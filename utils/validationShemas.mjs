export const validationSchema = {
  title: {
    isString: { errorMessage: "Must be a string" },
    notEmpty: { errorMessage: "Must be not Empty" },
    isLength: {
      options: {
        min: 2,
        max: 10,
      },
      errorMessage: "Must be at least 2-10 chars",
    },
    description: {
      isString: { errorMessage: "Must be a string" },
      notEmpty: { errorMessage: "Must be not Empty" },
      isLength: {
        options: {
          min: 2,
          max: 50,
        },
        errorMessage: "Must be at least 2-50 chars",
      },
    },
  },
};
