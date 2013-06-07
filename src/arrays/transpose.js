import "zip";

d4.transpose = function(matrix) {
  return d4.zip.apply(d4, matrix);
};
