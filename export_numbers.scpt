set inputFile to POSIX file "/Users/dai/Documents/trae_projects/yanshi1218/源文件/test_+5_V1-待去重待补全.numbers"
set outputFile to POSIX file "/Users/dai/Documents/trae_projects/yanshi1218/源文件/temp_v1_export.csv"

tell application "Numbers"
	activate
	open inputFile
	export front document to outputFile as CSV
	close front document saving no
end tell
