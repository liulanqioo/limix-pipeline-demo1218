// t-SNE JavaScript Implementation
// Based on Andrej Karpathy's tsnejs (MIT License)

var return_v = false;
var v_val = 0.0;

function gaussRandom() {
  if (return_v) {
    return_v = false;
    return v_val;
  }
  var u = 2 * Math.random() - 1;
  var v = 2 * Math.random() - 1;
  var r = u * u + v * v;
  if (r == 0 || r > 1) return gaussRandom();
  var c = Math.sqrt(-2 * Math.log(r) / r);
  v_val = v * c;
  return_v = true;
  return u * c;
}

function randn(mu, std) {
  return mu + gaussRandom() * std;
}

function zeros(n) {
  if (typeof (n) === 'undefined' || isNaN(n)) { return []; }
  if (typeof ArrayBuffer === 'undefined') {
    var a = new Array(n);
    for (var i = 0; i < n; i++) { a[i] = 0; }
    return a;
  } else {
    return new Float64Array(n);
  }
}

function randn2d(n, d) {
  var x = [];
  for (var i = 0; i < n; i++) {
    var xhere = [];
    for (var j = 0; j < d; j++) {
      xhere.push(randn(0.0, 1e-4));
    }
    x.push(xhere);
  }
  return x;
}

function L2(x1, x2) {
  var D = x1.length;
  var d = 0;
  for (var i = 0; i < D; i++) {
    var x1i = x1[i];
    var x2i = x2[i];
    d += (x1i - x2i) * (x1i - x2i);
  }
  return d;
}

export class tSNE {
  constructor(opt) {
    var opt = opt || {};
    this.perplexity = opt.perplexity || 30;
    this.dim = opt.dim || 2;
    this.epsilon = opt.epsilon || 10;
    this.iter = 0;
  }

  // this function takes a set of high-dimensional points
  // and creates matrix P from them using gaussian kernel
  initDataRaw(X) {
    var N = X.length;
    var D = X[0].length;
    var entropy = this.perplexity;
    var P = zeros(N * N);
    var row_P = zeros(N);
    var col_P = zeros(N);
    var val_P = zeros(N);

    // compute Hbeta
    // this function is a bit tricky, it computes Gaussian kernel values
    // and also adapts the width of the kernel (beta) to the desired perplexity
    // this is a binary search
    for (var i = 0; i < N; i++) {
      var betamin = -Infinity;
      var betamax = Infinity;
      var beta = 1; // initial value of precision
      var done = false;
      var maxtries = 50;

      // binary search to find a suitable precision beta
      // so that the entropy of the distribution is roughly log(perplexity)
      for (var tryi = 0; tryi < maxtries; tryi++) {

        // compute entropy and kernel row with beta precision
        var psum = 0.0;
        for (var j = 0; j < N; j++) {
          var d = 0.0;
          if (i !== j) { d = L2(X[i], X[j]); }
          var pj = Math.exp(-d * beta);
          if (i === j) { pj = 0; }
          row_P[j] = pj;
          psum += pj;
        }
        // normalize p and compute entropy
        var Hhere = 0.0;
        for (var j = 0; j < N; j++) {
          if (psum == 0) { var pj = 0; }
          else { var pj = row_P[j] / psum; }
          row_P[j] = pj;
          if (pj > 1e-7) Hhere -= pj * Math.log(pj);
        }

        // adjust beta based on result
        if (Hhere > Math.log(this.perplexity)) {
          // entropy is too high (distribution too flat), we need to increase precision
          // (make distribution more peaked), so increase beta
          betamin = beta;
          if (betamax === Infinity) { beta = beta * 2; }
          else { beta = (beta + betamax) / 2; }
        } else {
          // entropy is too low, decrease precision
          betamax = beta;
          if (betamin === -Infinity) { beta = beta / 2; }
          else { beta = (beta + betamin) / 2; }
        }
      }

      // copy over into P
      for (var j = 0; j < N; j++) {
        P[i * N + j] = row_P[j];
      }
    }

    // symmetrize P and normalize it to sum to 1 over all ij
    var Psum = 0.0;
    var N2 = N * N;
    for (var i = 0; i < N2; i++) {
      Psum += P[i];
    }
    for (var i = 0; i < N2; i++) {
      P[i] /= Psum;
    }
    for (var i = 0; i < N2; i++) {
      P[i] = Math.max(P[i], 1e-100);
    }
    this.P = P;
    this.N = N;
    this.initSolution(); // Refresh this
  }

  initSolution() {
    this.Y = randn2d(this.N, this.dim); // the solution
    this.gains = randn2d(this.N, this.dim); // step gains to accelerate progress
    this.ystep = randn2d(this.N, this.dim); // momentum accumulator
    this.iter = 0;
  }

  getSolution() {
    return this.Y;
  }

  step() {
    this.iter += 1;
    var N = this.N;

    var cost = 0.0;
    var Y = this.Y;
    var P = this.P;
    var pmul = this.iter < 100 ? 4 : 1; // trick that helps with local optima

    // compute Q distribution and gradient
    var Qu = zeros(N * N);
    var Qsum = 0.0;
    var ygrads = zeros(N * this.dim);

    for (var i = 0; i < N; i++) {
      for (var j = i + 1; j < N; j++) {
        var dsum = 0.0;
        dsum += (Y[i][0] - Y[j][0]) * (Y[i][0] - Y[j][0]);
        dsum += (Y[i][1] - Y[j][1]) * (Y[i][1] - Y[j][1]);
        var qu = 1.0 / (1.0 + dsum);
        Qu[i * N + j] = qu;
        Qu[j * N + i] = qu;
        Qsum += 2 * qu;
      }
    }

    // normalize Q distribution to sum to 1
    // note that the Qsum above was sum(Qu) instead of sum(Q)
    // but there is a 2 in Qsum so it's fine.
    // wait, Karpathy code: 
    // var Q = zeros(N * N);
    // for (var i = 0; i < N * N; i++) { Q[i] = Math.max(Qu[i] / Qsum, 1e-100); }

    // compute gradients
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        if (i === j) continue;
        var qu = Qu[i * N + j];
        var q = Math.max(qu / Qsum, 1e-100);
        var p = P[i * N + j];
        var premult = 4 * (pmul * p - q) * qu;
        for (var d = 0; d < this.dim; d++) {
          ygrads[i * this.dim + d] += premult * (Y[i][d] - Y[j][d]);
        }
      }
    }

    // update the solution
    var ymean = zeros(this.dim);
    for (var i = 0; i < N; i++) {
      for (var d = 0; d < this.dim; d++) {
        var gid = this.gains[i][d];
        var sid = this.ystep[i][d];
        var gradid = ygrads[i * this.dim + d];

        var newgid = (Math.sign(gradid) !== Math.sign(sid)) ? (gid + 0.2) : (gid * 0.8);
        if (newgid < 0.01) newgid = 0.01;
        this.gains[i][d] = newgid;

        var momval = this.iter < 250 ? 0.5 : 0.8;
        var newsid = momval * sid - this.epsilon * newgid * gradid;
        this.ystep[i][d] = newsid; // step
        this.Y[i][d] += newsid;
        ymean[d] += this.Y[i][d];
      }
    }

    // re-center Y
    for (var i = 0; i < N; i++) {
      for (var d = 0; d < this.dim; d++) {
        this.Y[i][d] -= ymean[d] / N;
      }
    }

    // return cost; // simplified
  }
}
