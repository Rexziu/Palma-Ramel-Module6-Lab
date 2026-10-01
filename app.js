"use strict";

const STUDENT_NUMBER_REGEX = /^\d{2}-\d{4}-\d{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^(09|\+639)\d{9}$/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_DIGIT_REGEX = /\d/;
const PASSWORD_SYMBOL_REGEX = /[@$!]/;
const PASSWORD_WHITESPACE_REGEX = /\s/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!])\S{8,}$/;


function isValidStudentNumber(value) {
  if (typeof value !== "string") {
    return false;
  }
  return STUDENT_NUMBER_REGEX.test(value.trim());
}

function isValidPassword(value) {
  if (typeof value !== "string") {
    return false;
  }
  return PASSWORD_REGEX.test(value);
}

function isValidEmail(value) {
  return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

function isValidMobileNumber(value) {
  return typeof value === "string" && MOBILE_REGEX.test(value.trim());
}

function getPasswordProblems(value) {
  const problems = [];
  if (value.length < 8) {
    problems.push("at least 8 characters");
  }
  if (!PASSWORD_UPPERCASE_REGEX.test(value)) {
    problems.push("an uppercase letter");
  }
  if (!PASSWORD_DIGIT_REGEX.test(value)) {
    problems.push("a digit");
  }
  if (!PASSWORD_SYMBOL_REGEX.test(value)) {
    problems.push("one of @, $, or !");
  }
  if (PASSWORD_WHITESPACE_REGEX.test(value)) {
    problems.push("no spaces");
  }
  return problems;
}

function initRegistrationForm() {
  const form = document.getElementById("registrationForm");
  if (!form) {
    return;
  }

  const el = (id) => document.getElementById(id);

  const fullName = el("fullName");
  const studentNumber = el("studentNumber");
  const email = el("email");
  const mobileNumber = el("mobileNumber");
  const password = el("password");
  const confirmPassword = el("confirmPassword");
  const course = el("course");
  const terms = el("terms");

  const passwordFeedback = el("passwordFeedback");
  const successMessage = el("successMessage");
  const registrationSummary = el("registrationSummary");

  const summaryFields = ["summaryName", "summaryStudentNumber", "summaryEmail",
    "summaryMobileNumber", "summaryCourse"];

  const SUCCESS_TEXT = "Registration details validated successfully!";

  function showError(input, message) {
    el(input.id + "Error").textContent = message;
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input) {
    el(input.id + "Error").textContent = "";
    input.setAttribute("aria-invalid", "false");
  }

  function hasError(input) {
    return el(input.id + "Error").textContent !== "";
  }

  function applyRule(input, message) {
    if (message) {
      showError(input, message);
      return false;
    }
    clearError(input);
    return true;
  }

  function checkFullName() {
    const value = fullName.value.trim();
    let message = "";
    if (value.length === 0) {
      message = "Enter your full name.";
    } else if (value.length < 2) {
      message = "Full name must have at least 2 characters.";
    }
    return applyRule(fullName, message);
  }

  function checkStudentNumber() {
    const value = studentNumber.value.trim();
    let message = "";
    if (value.length === 0) {
      message = "Enter your student number in the format 24-1234-123.";
    } else if (!isValidStudentNumber(value)) {
      message = "Enter a student number in the format 24-1234-123.";
    }
    return applyRule(studentNumber, message);
  }

  function checkEmail() {
    const value = email.value.trim();
    let message = "";
    if (value.length === 0) {
      message = "Enter your email address.";
    } else if (!isValidEmail(value)) {
      message = "Enter an email address like name@example.com, with no spaces.";
    }
    return applyRule(email, message);
  }

  function checkMobileNumber() {
    const value = mobileNumber.value.trim();
    let message = "";
    if (value.length === 0) {
      message = "Enter your mobile number.";
    } else if (!isValidMobileNumber(value)) {
      message = "Enter a mobile number starting with 09 or +639 followed by nine digits, with no spaces or hyphens.";
    }
    return applyRule(mobileNumber, message);
  }

  function checkPassword() {
    const value = password.value; 
    let message = "";
    if (value.length === 0) {
      message = "Enter a password.";
    } else if (!isValidPassword(value)) {
      message = "Password is missing: " + getPasswordProblems(value).join(", ") + ".";
    }
    return applyRule(password, message);
  }

  function checkConfirmPassword() {
    let message = "";
    if (confirmPassword.value.length === 0) {
      message = "Confirm your password.";
    } else if (confirmPassword.value !== password.value) {
      message = "Passwords do not match. Enter the same password in both fields.";
    }
    return applyRule(confirmPassword, message);
  }

  function checkCourse() {
    const message = (course.value === "BSIT" || course.value === "BSCS")
      ? "" : "Select your course: BSIT or BSCS.";
    return applyRule(course, message);
  }

  function checkTerms() {
    const message = terms.checked ? "" : "You must agree to the terms to register.";
    return applyRule(terms, message);
  }

  /* ---- live password feedback ---- */
  function updatePasswordFeedback() {
    const value = password.value;
    passwordFeedback.classList.remove("ok", "bad");
    if (value.length === 0) {
      passwordFeedback.textContent = "";
      return;
    }
    if (isValidPassword(value)) {
      passwordFeedback.textContent = "Password meets all requirements.";
      passwordFeedback.classList.add("ok");
    } else {
      passwordFeedback.textContent = "Password still needs: " + getPasswordProblems(value).join(", ") + ".";
      passwordFeedback.classList.add("bad");
    }
  }

  function clearOutput() {
    successMessage.textContent = "";
    successMessage.hidden = true;
    summaryFields.forEach(function (id) {
      el(id).textContent = "";
    });
    registrationSummary.hidden = true;
  }

  function showSummary() {
    el("summaryName").textContent = fullName.value.trim();
    el("summaryStudentNumber").textContent = studentNumber.value.trim();
    el("summaryEmail").textContent = email.value.trim();
    el("summaryMobileNumber").textContent = mobileNumber.value.trim();
    el("summaryCourse").textContent = course.value;
    successMessage.textContent = SUCCESS_TEXT;
    successMessage.hidden = false;
    registrationSummary.hidden = false;
  }


  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const results = [
      [fullName, checkFullName()],
      [studentNumber, checkStudentNumber()],
      [email, checkEmail()],
      [mobileNumber, checkMobileNumber()],
      [password, checkPassword()],
      [confirmPassword, checkConfirmPassword()],
      [course, checkCourse()],
      [terms, checkTerms()]
    ];

    const firstInvalid = results.find(function (pair) { return !pair[1]; });

    if (firstInvalid) {
      clearOutput();
      firstInvalid[0].focus();
    } else {
      showSummary();
    }
  });

  fullName.addEventListener("blur", checkFullName);

  password.addEventListener("input", function () {
    updatePasswordFeedback();
    if (hasError(password)) {
      checkPassword();
    }
    if (hasError(confirmPassword)) {
      checkConfirmPassword();
    }
  });

  [
    [fullName, checkFullName],
    [studentNumber, checkStudentNumber],
    [email, checkEmail],
    [mobileNumber, checkMobileNumber],
    [confirmPassword, checkConfirmPassword]
  ].forEach(function (pair) {
    pair[0].addEventListener("input", function () {
      if (hasError(pair[0])) {
        pair[1]();
      }
    });
  });

  course.addEventListener("change", checkCourse);
  terms.addEventListener("change", checkTerms);

  form.addEventListener("reset", function () {
    [fullName, studentNumber, email, mobileNumber, password,
      confirmPassword, course, terms].forEach(clearError);
    passwordFeedback.textContent = "";
    passwordFeedback.classList.remove("ok", "bad");
    clearOutput();
  });

  clearOutput();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegistrationForm);
  } else {
    initRegistrationForm();
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isValidStudentNumber, isValidPassword };
}
