import React, { useState } from "react";

const initialFormState = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const AccountForm = ({ onSubmit }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.displayName.trim()) nextErrors.displayName = "Display name is required";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (form.newPassword || form.confirmPassword || form.oldPassword) {
      if (!form.oldPassword) nextErrors.oldPassword = "Old password is required";
      if (!form.newPassword) nextErrors.newPassword = "New password is required";
      if (form.newPassword && form.newPassword.length < 8) {
        nextErrors.newPassword = "New password must be at least 8 characters";
      }
      if (form.newPassword !== form.confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const payload = { ...form };
      if (!form.oldPassword && !form.newPassword && !form.confirmPassword) {
        delete payload.oldPassword;
        delete payload.newPassword;
        delete payload.confirmPassword;
      }
      if (onSubmit) {
        await onSubmit(payload);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field) =>
    errors[field] ? (
      <div className="invalid-feedback d-block">{errors[field]}</div>
    ) : null;

  return (
    <form className="container py-4" onSubmit={handleSubmit} noValidate>
      <h2 className="fw-bold mb-4">My Account</h2>

      <div className="row">
        <div className="col-12">
          <h5 className="fw-semibold mb-3">Account Details</h5>
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="firstName" className="form-label">First name *</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
          />
          {renderError("firstName")}
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label htmlFor="lastName" className="form-label">Last name *</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
          />
          {renderError("lastName")}
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="displayName" className="form-label">Display name *</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
            placeholder="Display name"
            value={form.displayName}
            onChange={handleChange}
          />
          <div className="form-text">
            This will be how your name will be displayed in the account section
            and in reviews
          </div>
          {renderError("displayName")}
        </div>

        <div className="col-12 mb-4">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {renderError("email")}
        </div>

        <div className="col-12">
          <h5 className="fw-semibold mb-3">Password</h5>
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="oldPassword" className="form-label">Old password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            className={`form-control ${errors.oldPassword ? "is-invalid" : ""}`}
            placeholder="Old password"
            value={form.oldPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {renderError("oldPassword")}
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="newPassword" className="form-label">New password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
            placeholder="New password"
            value={form.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {renderError("newPassword")}
        </div>

        <div className="col-12 mb-4">
          <label htmlFor="confirmPassword" className="form-label">Repeat new password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            placeholder="Repeat new password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {renderError("confirmPassword")}
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={submitting}
            onClick={() => {
              setForm(initialFormState);
              setErrors({});
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default AccountForm;


