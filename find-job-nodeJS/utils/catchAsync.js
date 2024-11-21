module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch(err => {
      console.log(err)
      console.log("iam fired from the catchAsync 🧨🎇")
      next(err);
    });
  }
}