import * as Yup from "yup";
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const password = Yup.string()
  .matches(/^\S.*$/, "Cannot start with a whitespace")
  .matches(
    PASSWORD_REGEX,
    "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
  .required("Password is required");

const confirmPassword = Yup.string()
  .matches(/^\S.*$/, "Cannot start with a whitespace")
  .required("Confirm Password is required")
  .oneOf([Yup.ref("password")], "Passwords must match");

export const loginSchema = Yup.object({
  email: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .email("Invalid email")
    .required("Email is required"),
  password,
});

export const forgetPasswordSchema = Yup.object({
  email: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .email("Invalid email")

    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object().shape({
  password,
  confirmPassword,
});

export const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .required("Full Name is required"),
  email: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .email("Invalid email")
    .required("Email is required"),
  password,
  confirmPassword,
});

export const basicInfoSchema = Yup.object({
  gender: Yup.string()
    .oneOf(["Female", "Male", "Other"])
    .required("Gender is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 14)),
      "You must be at least 14 years old"
    ),
  height: Yup.number()
    .typeError("Height must be a number")
    .positive("Height must be positive")
    .required("Height is required"),
  weight: Yup.number()
    .typeError("Weight must be a number")
    .positive("Weight must be positive")
    .required("Weight is required"),
  about: Yup.string()
    .transform((value) => value.trimStart())
    .min(10, "About must be at least 10 characters")
    .max(500, "About must be less than 500 characters")
    .required("Please write something about yourself"),
});

export const editProfileSchema = Yup.object().shape({
  fullname: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .required("Full name is required"),
  email: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .email("Invalid email")
    .matches(/^\S*$/, "Whitespace is not allowed")
    .required("Email is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"])
    .required("Gender is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 14)),
      "You must be at least 14 years old"
    ),
  height_value: Yup.number()
    .positive("Height must be positive")
    .typeError("Height must be a number")
    .required("Height is required"),
  height_unit: Yup.string()
    .oneOf(["Cm", "Feet"])
    .required("Height unit is required"),
  weight_value: Yup.number()
    .positive("Weight must be positive")
    .typeError("Weight must be a number")
    .required("Weight is required"),
  weight_unit: Yup.string()
    .oneOf(["Kg", "Lbs"])
    .required("Weight unit is required"),
  fitness_goal: Yup.string().required("Please select your fitness goal"),
  preferred_workouts: Yup.array()
    .min(1, "Please select at least one preferred workout")
    .required("Preferred workouts are required"),
  experience_level: Yup.string().required(
    "Please select your experience level"
  ),
  bio: Yup.string()
    .transform((value) => value.trimStart())
    .min(10, "About must be at least 10 characters")
    .max(1000, "About must be less than 1000 characters")
    .required("Please write something about yourself"),
});

export const changepasswordSchema = Yup.object({
  old_password: password,
  new_password: password,
  confirm_password: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .required("Confirm Password is required")
    .oneOf([Yup.ref("new_password")], "Passwords must match"),
});

export const ExerciseSchema = Yup.object().shape({
  title: Yup.string()
    .matches(/^\S.*$/, "Cannot start with a whitespace")
    .required("Workout name is required"),
  target_part: Yup.string().required("Select target body part"),
  video: Yup.string().required("Please upload video"),
  thumbnail: Yup.string().required("Please upload thumbnail"),
  sets: Yup.array()
    .of(
      Yup.object().shape({
        reps: Yup.number()
          .positive("Reps must be positive")
          .typeError("Reps must be a number")
          .required("Reps is required"),
        rest: Yup.number()
          .positive("Rest must be positive")
          .typeError("Rest time must be a number")
          .required("Rest time is required"),
        weight_value: Yup.number()
          .positive("Weight must be positive")
          .typeError("Weight must be a number")
          .required("Weight is required"),
        weight_unit: Yup.string().required("Weight unit is required"),
      })
    )
    .min(1, "At least one set is required"),
});

export const addPostSchema = Yup.object().shape({
  caption: Yup.string().required("Caption is required"),
  workout_category: Yup.string().required("Please select a workout category"),
  media: Yup.array()
    .min(1, "Please upload at least one image or video")
    .required("Media is required"),
});

export const addWorkoutSchema = Yup.object().shape({
  is_draft: Yup.boolean().required(),
  title: Yup.string().required("Title is required"),
  caption: Yup.string().required("Caption is required"),
  fees: Yup.number()
    .min(0, "Fees cannot be negative")
    .typeError("Fees must be a number")
    .when("access", {
      is: "Paid",
      then: (schema) =>
        schema
          .required("Fees is required")
          .moreThan(0, "Fees must be greater than 0"),
      otherwise: (schema) => schema.notRequired(),
    }),
  workout_category: Yup.string().required("Workout Category is required"),
  thumbnail: Yup.string().required("Please upload thumbnail"),
});

export const reportUserSchema = Yup.object({
  reportType: Yup.string().required("Please select a report reason."),
  reason: Yup.string()
    .trim()
    .when("reportType", {
      is: "Other",
      then: (schema) =>
        schema
          .required("Reason is required")
          .test(
            "not-only-whitespace",
            "Reason cannot be only whitespace.",
            (value) => !!value && value.trim().length > 0
          )
          .max(1000, "Reason must not exceed 1000 characters."),
      otherwise: (schema) => schema.notRequired(),
    }),
});
