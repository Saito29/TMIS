import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../../../src/css/dashboard/app.css";
import { useDashboard } from "../../../src/js/dashboard/script.js";

export default function Dashboard() {
  useDashboard();

  useEffect(() => {
    const greeting = document.querySelector(".app-left-main-content-user-name");
    if (greeting) greeting.textContent = "Mark Kinnedy V. Anda! 👋";

    document
      .querySelectorAll(".card-allocation-summary > div:first-child > strong")
      .forEach((total) => {
        total.textContent = "₱2.78M";
      });
  }, []);

  return (
    <>
      
          <div className="app-wrapper">
            <nav className="app-header navbar navbar-expand">
              <div
                className="app-header-main d-flex justify-content-between align-items-center"
              >
                {/* logo and TMIS */}
                <div
                  className="app-header-left d-flex align-items-center justify-content-start"
                >
                  {/* Hide in large size */}
                  <button
                    className="btn app-mobile-toggle d-lg-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileNavMenu"
                    aria-controls="mobileNavMenu"
                  >
                    <i className="bi bi-list"></i>
                  </button>
                  {/* Bootstrap hides the logo below sm to keep the mobile header compact. */}
                  <div
                    className="app-logo d-none d-sm-flex align-items-center justify-content-start"
                  >
                    <a href="dashboard.html" className="text-decoration-none">
                      <img
                        src="/assets/logo/DA Logo/DA logo_120519.png"
                        alt="App_logo"
                        className="image-logo"
                      />
                    </a>
                    <div
                      className="app-logo-text d-flex align-items-center justify-content-start"
                    >
                      {/* Bootstrap hides the TMIS wordmark below sm (576px), preserving space for mobile navigation. */}
                      <h3 className="app-name d-none d-sm-block">TMIS</h3>
                      {/* <span className="text-logo-name">Training Management Information System</span> */}
                    </div>
                  </div>
                </div>
      
                {/* Navigation Bar */}
                <div
                  className="app-navigation-bar d-none d-lg-flex justify-content-center"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a href="dashboard.html" className="nav-link active-page">
                        <i className="bi bi-columns-gap"></i>
                        <span className="text-icon-active">Dashboard</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link"
                        role="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#participantHeaderCollapse"
                        aria-expanded="false"
                        aria-controls="participantHeaderCollapse"
                      >
                        <i className="bi bi-people-fill"></i>
                        <span className="text-icon">Participants</span>
                        <i className="bi bi-chevron-down ms-2"></i>
                      </a>
                      <div
                        className="collapse header-collapse"
                        id="participantHeaderCollapse"
                      >
                        <div className="header-collapse-menu">
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#createParticipantHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-plus-circle"></i>
                            <span>Create</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="createParticipantHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="../participants/create/register.html" className="header-sub-collapse-item">
                                <i className="bi bi-person-fill-add"></i>
                                <span>Register</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#updateParticipantHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-arrow-repeat"></i>
                            <span>Update</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="updateParticipantHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#forReview" className="header-sub-collapse-item">
                                <i className="bi bi-clipboard2-check-fill"></i>
                                <span>For Review</span>
                                <span className="badge badge-review">34</span>
                              </a>
                              <a href="#forApproval" className="header-sub-collapse-item">
                                <i className="bi bi-clipboard2-check-fill"></i>
                                <span>For Approval</span>
                                <span className="badge badge-approval">23</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#detailsParticipantHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Details</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="detailsParticipantHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#allStatus" className="header-sub-collapse-item">
                                <i className="bi bi-list-check"></i>
                                <span>All Status</span>
                              </a>
                              <a
                                href="#approvedAccepted"
                                className="header-sub-collapse-item"
                              >
                                <i className="bi bi-check2-circle"></i>
                                <span>Approved & Accepted</span>
                              </a>
                              <a href="#incomplete" className="header-sub-collapse-item">
                                <i className="bi bi-person-x-fill"></i>
                                <span>Incomplete</span>
                              </a>
                              <a href="#inactive" className="header-sub-collapse-item">
                                <i className="bi bi-person-walking"></i>
                                <span>Inactive</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link"
                        role="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#trainingHeaderCollapse"
                        aria-expanded="false"
                        aria-controls="trainingHeaderCollapse"
                      >
                        <i className="bi bi-book-fill"></i>
                        <span className="text-icon">Training</span>
                        <i className="bi bi-chevron-down ms-2"></i>
                      </a>
                      <div
                        className="collapse header-collapse"
                        id="trainingHeaderCollapse"
                      >
                        <div className="header-collapse-menu">
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#createTrainingHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-plus-circle"></i>
                            <span>Create</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="createTrainingHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#register" className="header-sub-collapse-item">
                                <i className="bi bi-clipboard-plus-fill"></i>
                                <span>Register</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#updateTrainingHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-arrow-repeat"></i>
                            <span>Update</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="updateTrainingHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#forReview" className="header-sub-collapse-item">
                                <i className="bi bi-clipboard2-check-fill"></i>
                                <span>For Review</span>
                                <span className="badge badge-review">34</span>
                              </a>
                              <a href="#forApproval" className="header-sub-collapse-item">
                                <i className="bi bi-clipboard2-check-fill"></i>
                                <span>For Approval</span>
                                <span className="badge badge-approval">23</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#detailsTrainingHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Details</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="detailsTrainingHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a
                                href="#allTrainingStatus"
                                className="header-sub-collapse-item"
                              >
                                <i className="bi bi-person-video3"></i>
                                <span>All Status</span>
                              </a>
                              <a
                                href="#approvedTraining"
                                className="header-sub-collapse-item"
                              >
                                <i className="bi bi-person-workspace"></i>
                                <span>Approved & Accepted</span>
                              </a>
                              <a
                                href="#incompleteTraining"
                                className="header-sub-collapse-item"
                              >
                                <i className="bi bi-person-fill-gear"></i>
                                <span>Incomplete</span>
                              </a>
                              <a
                                href="#inactiveTraining"
                                className="header-sub-collapse-item"
                              >
                                <i className="bi bi-envelope-exclamation-fill"></i>
                                <span>Inactive</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link"
                        role="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#evaluationHeaderCollapse"
                        aria-expanded="false"
                        aria-controls="evaluationHeaderCollapse"
                      >
                        <i className="bi bi-file-earmark-check"></i>
                        <span className="text-icon">Evaluation</span>
                        <i className="bi bi-chevron-down ms-2"></i>
                      </a>
                      <div
                        className="collapse header-collapse"
                        id="evaluationHeaderCollapse"
                      >
                        <div className="header-collapse-menu">
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#createEvaluationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-plus-circle"></i>
                            <span>Create</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="createEvaluationHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-text"></i>
                                <span>Pre-test Questionaire</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-text"></i>
                                <span>Post-test Questionaire</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-text"></i>
                                <span>Training Evaluation</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-text"></i>
                                <span>Resource Person Evaluation</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#encodeEvaluationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-code-slash"></i>
                            <span>Encode</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="encodeEvaluationHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-ruled"></i>
                                <span>Pre-test Evaluation</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-ruled"></i>
                                <span>Post-test Evaluation</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-ruled"></i>
                                <span>Training Evaluation</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-file-earmark-ruled"></i>
                                <span>Resource Person Evaluation</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#updateEvaluationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-arrow-repeat"></i>
                            <span>Update</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="updateEvaluationHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-send-exclamation-fill"></i>
                                <span>For review</span>
                                <span className="badge rounded-pill badge-review"
                                  >34</span
                                >
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-send-check-fill"></i>
                                <span>For approval</span>
                                <span className="badge rounded-pill badge-approval"
                                  >23</span
                                >
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#detailsEvaluationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Details</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div className="collapse" id="detailsEvaluationHeaderCollapse">
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-journal-text"></i>
                                <span>All status</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-journal-check"></i>
                                <span>Approved & accepted</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-journal-code"></i>
                                <span>Incomplete</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-journal-x"></i>
                                <span>Inactive</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#"
                        className="nav-link"
                        role="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#administrationHeaderCollapse"
                        aria-expanded="false"
                        aria-controls="administrationHeaderCollapse"
                      >
                        <i className="bi bi-sliders"></i>
                        <span className="text-icon">Administration</span>
                        <i className="bi bi-chevron-down ms-2"></i>
                      </a>
                      <div
                        className="collapse header-collapse"
                        id="administrationHeaderCollapse"
                      >
                        <div className="header-collapse-menu">
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#createAdministrationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-plus-circle"></i>
                            <span>Create</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div
                            className="collapse"
                            id="createAdministrationHeaderCollapse"
                          >
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-person-add"></i>
                                <span>Register</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#updateAdministrationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-arrow-repeat"></i>
                            <span>Update</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div
                            className="collapse"
                            id="updateAdministrationHeaderCollapse"
                          >
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-person-check"></i>
                                <span>For approval</span>
                              </a>
                            </div>
                          </div>
      
                          <a
                            href="#"
                            className="header-collapse-item"
                            role="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#detailsAdministrationHeaderCollapse"
                            aria-expanded="false"
                          >
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Details</span>
                            <i className="bi bi-chevron-down ms-auto"></i>
                          </a>
                          <div
                            className="collapse"
                            id="detailsAdministrationHeaderCollapse"
                          >
                            <div className="header-sub-collapse-menu">
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-person-arms-up"></i>
                                <span>All status</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-person-hearts"></i>
                                <span>Approved & accepted</span>
                              </a>
                              <a href="#" className="header-sub-collapse-item">
                                <i className="bi bi-person-fill-gear"></i>
                                <span>Inactive</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
      
                {/* Notification & User profile */}
                <div className="app-noti-profile d-flex align-items-center">
                  {/* Notification menu stays end-aligned so its wide content cannot enlarge the mobile layout. */}
                  <div className="app-notification dropdown">
                    <button
                      className="notification-btn position-relative"
                      type="button"
                      id="notificationDropdown"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                      aria-label="Open notifications"
                    >
                      <i className="bi bi-bell-fill"></i>
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill notification-count"
                        >3</span
                      >
                    </button>
                    {/* Notification Dropdown */}
                    <div
                      className="dropdown-menu dropdown-menu-end notification-menu"
                      aria-labelledby="notificationDropdown"
                    >
                      <div className="notification-menu-header">
                        <div>
                          <span className="notification-menu-title">Notifications</span>
                          <span className="notification-menu-subtitle"
                            >3 unread updates</span
                          >
                        </div>
                        <div className="notification-menu-actions">
                          <button type="button" className="notification-mark-read">
                            Mark all read
                          </button>
                          <button type="button" className="notification-clear-all">
                            Clear all
                          </button>
                        </div>
                      </div>
                      <div className="notification-menu-list">
                        <button
                          type="button"
                          className="notification-menu-item is-unread"
                          data-bs-toggle="modal"
                          data-bs-target="#notificationDetailModal"
                          data-notification-type="Approval required"
                          data-notification-time="Today, 9:20 PM"
                          data-notification-title="Training proposal review needed"
                          data-notification-description="The Advanced Data Analysis training proposal submitted by John Doe is ready for your review. Your feedback is required before it can proceed to approval."
                          data-notification-action="Review proposal"
                        >
                          <span
                            className="notification-item-icon notification-item-icon--approval"
                            ><i className="bi bi-clipboard2-check"></i
                          ></span>
                          <span className="notification-item-copy">
                            <span className="notification-item-title"
                              >Training proposal review needed</span
                            >
                            <span className="notification-item-summary"
                              >Advanced Data Analysis needs your feedback.</span
                            >
                            <span className="notification-item-time">Today, 9:20 PM</span>
                          </span>
                          <span
                            className="notification-unread-dot"
                            aria-label="Unread"
                          ></span>
                        </button>
                        <button
                          type="button"
                          className="notification-menu-item is-unread"
                          data-bs-toggle="modal"
                          data-bs-target="#notificationDetailModal"
                          data-notification-type="Budget update"
                          data-notification-time="Today, 2:45 PM"
                          data-notification-title="District allocation records updated"
                          data-notification-description="The beneficiary district allocation records have been updated. Open this notification to review the updated district entries."
                          data-notification-action="View allocation records"
                        >
                          <span
                            className="notification-item-icon notification-item-icon--budget"
                            ><i className="bi bi-wallet2"></i
                          ></span>
                          <span className="notification-item-copy">
                            <span className="notification-item-title"
                              >District allocation records updated</span
                            >
                            <span className="notification-item-summary"
                              >Beneficiary district entries are ready to review.</span
                            >
                            <span className="notification-item-time">Today, 2:45 PM</span>
                          </span>
                          <span
                            className="notification-unread-dot"
                            aria-label="Unread"
                          ></span>
                        </button>
                        <button
                          type="button"
                          className="notification-menu-item is-unread"
                          data-bs-toggle="modal"
                          data-bs-target="#notificationDetailModal"
                          data-notification-type="Participant update"
                          data-notification-time="Yesterday, 4:10 PM"
                          data-notification-title="Participant registration approved"
                          data-notification-description="A participant registration has been approved and is now included in the beneficiary record for its assigned district."
                          data-notification-action="View participant"
                        >
                          <span
                            className="notification-item-icon notification-item-icon--participant"
                            ><i className="bi bi-person-check"></i
                          ></span>
                          <span className="notification-item-copy">
                            <span className="notification-item-title"
                              >Participant registration approved</span
                            >
                            <span className="notification-item-summary"
                              >A new beneficiary record is now active.</span
                            >
                            <span className="notification-item-time"
                              >Yesterday, 4:10 PM</span
                            >
                          </span>
                          <span
                            className="notification-unread-dot"
                            aria-label="Unread"
                          ></span>
                        </button>
                      </div>
                      <button type="button" className="notification-view-all">
                        View all notifications <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
      
                  {/* User profile and role */}
                  <div className="app-profile dropdown-center">
                    <a
                      href="#"
                      className="nav-link dropdown-toggle profile-button"
                      role="button"
                      data-bs-auto-close="outside"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {/* User profile */}
                      <span className="user-avatar-wrap">
                        <img
                          src="/assets/user_profile/user_profile.jpg"
                          alt="User_profile"
                          className="user-profile"
                        />
                        <span className="user-status-dot"></span>
                      </span>
      
                      {/* User name */}
                      <div className="profile-meta">
                        <span className="profile-name">Mark Kinnedy V. Anda</span>
                        <small className="profile-role">System Administrator</small>
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end user-menu">
                      <li>
                        <h6 className="dropdown-header user-menu-header">
                          Mark Kinnedy V. Anda
                        </h6>
                      </li>
                      <li>
                        <span className="dropdown-item-text">System Administrator</span>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a href="#" className="dropdown-item">
                          <i className="bi bi-person-fill-gear"></i>
                          <span>Profile</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="dropdown-item">
                          <i className="bi bi-substack"></i>
                          <span>Logs</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="dropdown-item">
                          <i className="bi bi-gear-wide"></i>
                          <span>Settings</span>
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a href="#" className="dropdown-item sign-out-item">
                          <i className="bi bi-box-arrow-in-right"></i>
                          <span>Sign out</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
      
            {/* Main Body page */}
            <main className="app-main">
              {/* Bootstrap container and grid keep dashboard cards fluid on every viewport. */}
              <div className="app-main-body container-fluid px-3 px-md-4">
                {/* first row */}
                {/* Responsive grid: cards stack on phones, then use the dashboard split from lg screens. */}
                <div className="row first-row g-4">
                  {/* App left main content first row */}
                  <div className="col-12 col-lg-4">
                    <div className="app-left-main-content-body h-100">
                      {/* User intro left */}
                      <div className="app-left-main-content-user-intro">
                        <h5 className="app-left-main-content-user-hello">Hello,</h5>
                        <h5 className="app-left-main-content-user-name">
                          Mark Kinnedy V. Anda!ðŸ‘‹
                        </h5>
                        <small className="app-left-main-content-user-details"
                          >Here's what's happening with your training programs
                          today.</small
                        >
                      </div>
                      <div className="app-left-main-content-date">
                        <i className="bi bi-calendar3"></i>
                        <span className="app-left-content-date">July 14, 2026</span>
                        <span className="app-left-content-divider"></span>
                        <span className="app-left-content-day">Tuesday</span>
                      </div>
                      <div className="app-left-main-content-training">
                        <h6 className="app-left-main-content-title">
                          "Specialized Swine Production Training in Brgy. Villa
                          Manzano Norte."
                        </h6>
                      </div>
                    </div>
                  </div>
                  {/* app right main content first row */}
                  <div className="col-12 col-lg-8">
                    <div className="row first-row-right g-2">
                      {/* Trainings */}
                      <div className="col-12 col-md-6">
                        {/* Card wrapper */}
                        <div className="card card-app-right-main-content h-100">
                          <div className="card-header">
                            <div
                              className="card-header-wrapper px-3 py-2 px-md-3 py-md-2"
                            >
                              <div className="card-header-icon">
                                <i className="bi bi-tv"></i>
                              </div>
                              <div className="card-header-title">
                                <h5 className="card-header-text">
                                  Total Capacity-Building Activities Conducted
                                </h5>
                                <span className="card-header-context">32</span>
                              </div>
                              <div className="card-tools">
                                {/* card-tools */}
                                <button
                                  type="button"
                                  className="btn btn-modal"
                                  aria-label="Summary view"
                                  title="Summary view"
                                  data-bs-toggle="modal"
                                  data-bs-target="#dashboardReportModal"
                                  data-report-key="activities"
                                >
                                  <i className="bi bi-filter-right"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-body px-3 px-md-3 pt-0 pb-3">
                            <div
                              className="card-summary-row d-flex flex-column flex-sm-row align-items-start align-items-sm-center"
                            >
                              <div className="card-chart-label">
                                <span className="card-chart-eyebrow"
                                  >Training activity</span
                                >
                                <span className="card-chart-period"
                                  >January - December</span
                                >
                              </div>
                              <div
                                className="card-vs-year align-self-stretch align-self-sm-end"
                              >
                                <div className="card-vs-year-percentage">
                                  <i className="bi bi-arrow-up-short"></i>
                                  <span className="card-data-text-vs-year">12%</span>
                                </div>
                                <span className="card-data-vs-year">vs Last year</span>
                              </div>
                            </div>
                            <div className="card-chart-helper">
                              <i className="bi bi-cursor-fill"></i>
                              <span>Hover a month to see municipality details</span>
                            </div>
                            <div className="card-chart" id="totalTrainingChart"></div>
                          </div>
                          <div className="card-footer">
                            <span className="card-footer-context"
                              >Total training sessions conducted across all
                              municipalities.</span
                            >
                          </div>
                        </div>
                      </div>
                      {/* Total Participants */}
                      <div className="col-12 col-md-6">
                        {/* Card wrapper */}
                        <div className="card card-app-right-main-content h-100">
                          <div className="card-header">
                            <div
                              className="card-header-wrapper px-3 py-2 px-md-3 py-md-2"
                            >
                              <div className="card-header-icon participants-icon">
                                <i className="bi bi-people"></i>
                              </div>
                              <div className="card-header-title">
                                <h5 className="card-header-text">Farmers Trained</h5>
                                <span className="card-header-context">120</span>
                              </div>
                              <div className="card-tools">
                                {/* card-tools */}
                                <button
                                  type="button"
                                  className="btn btn-modal"
                                  aria-label="Summary view"
                                  title="Summary view"
                                  data-bs-toggle="modal"
                                  data-bs-target="#dashboardReportModal"
                                  data-report-key="participants"
                                >
                                  <i className="bi bi-filter-right"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-body px-3 px-md-3 pt-0 pb-3">
                            <div
                              className="card-summary-row d-flex flex-column flex-sm-row align-items-start align-items-sm-center"
                            >
                              <div className="card-chart-label">
                                <span className="card-chart-eyebrow"
                                  >Paricipants activity</span
                                >
                                <span className="card-chart-period"
                                  >January - December</span
                                >
                              </div>
                              <div
                                className="card-vs-year align-self-stretch align-self-sm-end"
                              >
                                <div className="card-vs-year-percentage">
                                  <i className="bi bi-arrow-up-short"></i>
                                  <span className="card-data-text-vs-year">25%</span>
                                </div>
                                <span className="card-data-vs-year">vs Last year</span>
                              </div>
                            </div>
                            <div className="card-chart-helper">
                              <i className="bi bi-cursor-fill"></i>
                              <span>Hover a month to see municipality details</span>
                            </div>
                            <div className="card-chart" id="totalParticipantsChart"></div>
                          </div>
                          <div className="card-footer">
                            <span className="card-footer-context"
                              >Total participants across all municipalities.</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* second row */}
                {/* Responsive chart cards: one column on small screens, two columns from lg upward. */}
                <div className="row second-row g-4">
                  {/* Total FCA */}
                  <div className="col-12 col-lg-6">
                    {/* Card wrapper */}
                    <div className="card card-app-right-main-content h-100">
                      <div className="card-header">
                        <div className="card-header-wrapper px-3 py-2 px-md-3 py-md-2">
                          <div className="card-header-icon fca-icon">
                            <i className="bi bi-diagram-3-fill"></i>
                          </div>
                          <div className="card-header-title">
                            <h5 className="card-header-text">Total FCA</h5>
                            <span className="card-header-context">37</span>
                          </div>
                          <div className="card-tools">
                            {/* card-tools */}
                            <button
                              type="button"
                              className="btn btn-modal"
                              aria-label="Summary view"
                              title="Summary view"
                              data-bs-toggle="modal"
                              data-bs-target="#dashboardReportModal"
                              data-report-key="fca"
                            >
                              <i className="bi bi-filter-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="card-body px-3 px-md-3 pt-0 pb-3">
                        <div
                          className="card-summary-row d-flex flex-column flex-sm-row align-items-start align-items-sm-center"
                        >
                          <div className="card-chart-label">
                            <span className="card-chart-eyebrow">FCA Uploaded</span>
                            <span className="card-chart-period">January - December</span>
                          </div>
                          <div
                            className="card-vs-year align-self-stretch align-self-sm-end"
                          >
                            <div className="card-vs-year-percentage">
                              <i className="bi bi-arrow-up-short"></i>
                              <span className="card-data-text-vs-year">12%</span>
                            </div>
                            <span className="card-data-vs-year">vs Last year</span>
                          </div>
                        </div>
                        <div className="card-chart-helper">
                          <i className="bi bi-cursor-fill"></i>
                          <span>Hover a month to see municipality details</span>
                        </div>
                        <div className="card-chart" id="totalFAChart"></div>
                      </div>
                      <div className="card-footer">
                        <span className="card-footer-context"
                          >Total Farmer Association uploaded across all
                          municipalities.</span
                        >
                      </div>
                    </div>
                  </div>
                  {/* Per District */}
                  <div className="col-12 col-lg-6">
                    {/* Card wrapper */}
                    <div className="card card-app-right-main-content h-100">
                      <div className="card-header">
                        <div className="card-header-wrapper px-3 py-2 px-md-3 py-md-2">
                          <div className="card-header-icon district-icon">
                            <i className="bi bi-geo"></i>
                          </div>
                          <div className="card-header-title">
                            <h5 className="card-header-text">
                              Allocated Training Budget by District
                            </h5>
                          </div>
                          <div className="card-tools">
                            {/* card-tools */}
                            <button
                              type="button"
                              className="btn btn-modal"
                              aria-label="Summary view"
                              title="Summary view"
                              data-bs-toggle="modal"
                              data-bs-target="#dashboardReportModal"
                              data-report-key="budget"
                            >
                              <i className="bi bi-filter-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="card-body px-3 px-md-3 pt-0 pb-3">
                        <div
                          className="card-summary-row d-flex flex-column flex-sm-row align-items-start align-items-sm-center"
                        >
                          <div className="card-chart-label">
                            <span className="card-chart-eyebrow"
                              >Total allocated training funds by district</span
                            >
                            <span className="card-chart-period"
                              >8 beneficiary districts</span
                            >
                          </div>
                        </div>
                        <div className="card-chart-helper">
                          <i className="bi bi-cursor-fill"></i>
                          <span
                            >Hover a district to see its total allocated amount</span
                          >
                        </div>
                        <div
                          className="card-chart"
                          id="totalAllocatedDistrictChart"
                        ></div>
                      </div>
                      <div className="card-footer">
                        <span className="card-footer-context"
                          >Total training funds allocated across the eight beneficiary
                          districts.</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                {/* third row */}
                {/* Province and municipality allocation report. */}
                <div className="row third-row g-4">
                  <div className="col-12 col-xl-6">
                    <div className="row g-4">
                      {/* Allocated training funds by province */}
                      <div className="col-12">
                        <div
                          className="card card-app-right-main-content card-allocation-breakdown province-allocation-card h-100"
                        >
                          <div className="card-header card-allocation-header">
                            <div className="card-allocation-title-group">
                              <div className="card-allocation-title-row">
                                <span className="card-allocation-icon"
                                  ><i className="bi bi-map-fill"></i
                                ></span>
                                <h5>Allocated Training Funds by Province</h5>
                                <button
                                  type="button"
                                  className="btn btn-toggle-info"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Shows the total training funds allocated to each province."
                                  aria-label="About allocated training funds by province"
                                >
                                  <i className="bi bi-exclamation-circle"></i>
                                </button>
                              </div>
                              <span
                                >Provincial allocation overview for the current
                                reporting period.</span
                              >
                            </div>
                            <button
                              type="button"
                              className="btn btn-modal"
                              data-bs-toggle="modal"
                              data-bs-target="#dashboardReportModal"
                              data-report-key="provinceBudget"
                              title="View province allocation details"
                              aria-label="View province allocation details"
                            >
                              <i className="bi bi-filter-right"></i>
                            </button>
                          </div>
                          <div className="card-body card-allocation-body">
                            <div className="card-allocation-summary">
                              <div>
                                <span>Total allocated</span><strong>â‚±2.78M</strong>
                              </div>
                              <div>
                                <span>Highest allocation</span><strong>Quezon</strong>
                              </div>
                              <div>
                                <span>Provinces covered</span><strong>3</strong>
                              </div>
                            </div>
                            <div
                              className="card-allocation-chart"
                              id="allocatedProvinceChart"
                            ></div>
                          </div>
                        </div>
                      </div>
                      {/* Moved to the full-width sixth dashboard row. */}
                      <div className="d-none">
                        <div
                          className="card card-app-right-main-content card-allocation-breakdown h-100"
                        >
                          <div className="card-header card-allocation-header">
                            <div className="card-allocation-title-group">
                              <div className="card-allocation-title-row">
                                <span className="card-allocation-icon"
                                  ><i className="bi bi-geo-alt-fill"></i
                                ></span>
                                <h5>Allocated Training Funds by Municipality</h5>
                                <button
                                  type="button"
                                  className="btn btn-toggle-info"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Shows the total training funds allocated to each beneficiary municipality."
                                  aria-label="About allocated training funds by municipality"
                                >
                                  <i className="bi bi-exclamation-circle"></i>
                                </button>
                              </div>
                              <span
                                >Municipality allocation comparison across the covered
                                provinces.</span
                              >
                            </div>
                            <button
                              type="button"
                              className="btn btn-modal"
                              data-bs-toggle="modal"
                              data-bs-target="#dashboardReportModal"
                              data-report-key="municipalityBudget"
                              title="View municipality allocation details"
                              aria-label="View municipality allocation details"
                            >
                              <i className="bi bi-filter-right"></i>
                            </button>
                          </div>
                          <div className="card-body card-allocation-body">
                            <div className="card-allocation-summary">
                              <div>
                                <span>Total allocated</span><strong>â‚±2.78M</strong>
                              </div>
                              <div>
                                <span>Top municipality</span><strong>Quezon</strong>
                              </div>
                              <div>
                                <span>Municipalities covered</span><strong>8</strong>
                              </div>
                            </div>
                            <div
                              className="card-allocation-chart"
                              id="allocatedMunicipalityChartLegacy"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-xl-6">
                    <div
                      className="card card-app-right-main-content card-allocation-breakdown municipality-allocation-card h-100"
                    >
                      <div className="card-header card-allocation-header">
                        <div className="card-allocation-title-group">
                          <div className="card-allocation-title-row">
                            <span className="card-allocation-icon"
                              ><i className="bi bi-geo-alt-fill"></i
                            ></span>
                            <h5>Allocated Training Funds by Municipality</h5>
                            <button
                              type="button"
                              className="btn btn-toggle-info"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Shows the total training funds allocated to each beneficiary municipality."
                              aria-label="About allocated training funds by municipality"
                            >
                              <i className="bi bi-exclamation-circle"></i>
                            </button>
                          </div>
                          <span
                            >Municipality allocation comparison across the covered
                            provinces.</span
                          >
                        </div>
                        <button
                          type="button"
                          className="btn btn-modal"
                          data-bs-toggle="modal"
                          data-bs-target="#dashboardReportModal"
                          data-report-key="municipalityBudget"
                          title="View municipality allocation details"
                          aria-label="View municipality allocation details"
                        >
                          <i className="bi bi-filter-right"></i>
                        </button>
                      </div>
                      <div className="card-body card-allocation-body">
                        <div className="card-allocation-summary">
                          <div>
                            <span>Total allocated</span><strong>â‚±2.78M</strong>
                          </div>
                          <div>
                            <span>Top municipality</span><strong>Quezon</strong>
                          </div>
                          <div>
                            <span>Municipalities covered</span><strong>8</strong>
                          </div>
                        </div>
                        <div
                          className="card-allocation-chart"
                          id="allocatedMunicipalityChart"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* fourth row */}
                {/* Beneficiary card grows from full width to a compact dashboard column. */}
                <div className="row fourth-row g-4">
                  {/* Total Gender per youth, adult, senior */}
                  <div className="col-12 col-md-4 col-lg-4">
                    <div className="card card-beneficiary">
                      <div
                        className="card-header d-flex align-items-start position-relative p-3 pe-5 pb-2 lh-sm bg-transparent border-0"
                      >
                        <div className="card-title-group">
                          <h6 className="card-title-gender">
                            Beneficiaries by Age &amp; Sex
                          </h6>
                          <p className="card-beneficiary-description">
                            Distribution of beneficiaries across age groups, separated
                            by sex.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-modal position-absolute top-0 end-0 m-3"
                          title="View beneficiary summary"
                          aria-label="View beneficiary summary"
                          data-bs-toggle="modal"
                          data-bs-target="#dashboardReportModal"
                          data-report-key="ageSex"
                        >
                          <i className="bi bi-filter-right"></i>
                        </button>
                      </div>
                      {/* beneficiary data of age / sex */}
                      <div className="card-body px-2 px-sm-3 pt-0 pb-3">
                        <div
                          className="card-chart-beneficiary"
                          id="beneficiaryAgeSexChart"
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Total Gender per male and female */}
                  <div className="col-12 col-md-4 col-lg-4">
                    <div className="card card-beneficiary">
                      <div
                        className="card-header d-flex align-items-start position-relative p-3 pe-5 pb-2 lh-sm bg-transparent border-0"
                      >
                        <div className="card-title-group">
                          <h6 className="card-title-gender">Beneficiaries by sex</h6>
                          <p className="card-beneficiary-description">
                            Distribution of beneficiaries across by sex
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-modal position-absolute top-0 end-0 m-3"
                          title="View beneficiary summary"
                          aria-label="View beneficiary summary"
                          data-bs-toggle="modal"
                          data-bs-target="#dashboardReportModal"
                          data-report-key="sex"
                        >
                          <i className="bi bi-filter-right"></i>
                        </button>
                      </div>
                      {/* beneficiary data of age / sex */}
                      <div className="card-body px-2 px-sm-3 pt-0 pb-3">
                        <div
                          className="card-chart-beneficiary"
                          id="beneficiarySexChart"
                        ></div>
                      </div>
                    </div>
                  </div>
                  {/* Total PWD, 4ps, IP */}
                  <div className="col-12 col-md-4 col-lg-4">
                    <div className="card card-beneficiary">
                      <div
                        className="card-header d-flex align-items-start position-relative p-3 pe-5 pb-2 lh-sm bg-transparent border-0"
                      >
                        <div className="card-title-group">
                          <h6 className="card-title-gender">Beneficiary Groups</h6>
                          <p className="card-beneficiary-description">
                            Distribution of beneficiaries across by group
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-modal position-absolute top-0 end-0 m-3"
                          title="View beneficiary summary"
                          aria-label="View beneficiary summary"
                          data-bs-toggle="modal"
                          data-bs-target="#dashboardReportModal"
                          data-report-key="groups"
                        >
                          <i className="bi bi-filter-right"></i>
                        </button>
                      </div>
                      {/* beneficiary data of age / sex */}
                      <div className="card-body px-2 px-sm-3 pt-0 pb-3">
                        {/* Bootstrap w-100 keeps this chart fluid within every grid column. */}
                        <div
                          className="card-chart-beneficiary w-100"
                          id="beneficiaryGroupChart"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* fifth row */}
                {/* Upcoming training and Highlights and recommendation */}
                <div className="row fifth-row g-4">
                  <div className="col-12 col-xl-4">
                    <div className="card card-upcoming-training">
                      <div className="card-header">
                        <h5 className="card-header-text">Upcoming Training</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {/* card-wrapper */}
                          <div className="card-wrapper col-12 mb-3">
                            {/* date */}
                            <div className="card-date">
                              <span className="card-month">July</span>
                              <span className="card-date-text">07</span>
                            </div>
                            {/* card training, date, and location */}
                            <div className="card-training-wrapper">
                              <div className="card-training-title">
                                <a href="#" className="card-text-title nav-link">
                                  Retooling on Basic Bookkeeping, RecordKeeping, and
                                  Crafting Resolution
                                </a>
                              </div>
                              <div className="card-dl-range">
                                {/* card date range */}
                                <div className="card-date-range">
                                  <i className="bi bi-calendar3"></i>
                                  <span className="card-range-date">
                                    July 14-17, 2026
                                  </span>
                                </div>
                                <div className="card-location">
                                  <i className="bi bi-geo-alt"></i>
                                  <span className="card-location-text">
                                    Perez and Quezon, Quezon
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* training slot */}
                            <div className="card-slot">
                              <span className="slot-text">Packs</span>
                              <span className="slot-number">35</span>
                            </div>
                          </div>
                          {/* card-wrapper */}
                          <div className="card-wrapper col-12 mb-3">
                            {/* date */}
                            <div className="card-date">
                              <span className="card-month">July</span>
                              <span className="card-date-text">07</span>
                            </div>
                            {/* card training, date, and location */}
                            <div className="card-training-wrapper">
                              <div className="card-training-title">
                                <a href="#" className="card-text-title nav-link">
                                  Retooling on Basic Bookkeeping, RecordKeeping, and
                                  Crafting Resolution
                                </a>
                              </div>
                              <div className="card-dl-range">
                                {/* card date range */}
                                <div className="card-date-range">
                                  <i className="bi bi-calendar3"></i>
                                  <span className="card-range-date">
                                    July 14-17, 2026
                                  </span>
                                </div>
                                <div className="card-location">
                                  <i className="bi bi-geo-alt"></i>
                                  <span className="card-location-text">
                                    Perez and Quezon, Quezon
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* training slot */}
                            <div className="card-slot">
                              <span className="slot-text">Packs</span>
                              <span className="slot-number">35</span>
                            </div>
                          </div>
                          {/* card-wrapper */}
                          <div className="card-wrapper col-12 mb-3">
                            {/* date */}
                            <div className="card-date">
                              <span className="card-month">July</span>
                              <span className="card-date-text">07</span>
                            </div>
                            {/* card training, date, and location */}
                            <div className="card-training-wrapper">
                              <div className="card-training-title">
                                <a href="#" className="card-text-title nav-link">
                                  Retooling on Basic Bookkeeping, RecordKeeping, and
                                  Crafting Resolution
                                </a>
                              </div>
                              <div className="card-dl-range">
                                {/* card date range */}
                                <div className="card-date-range">
                                  <i className="bi bi-calendar3"></i>
                                  <span className="card-range-date">
                                    July 14-17, 2026
                                  </span>
                                </div>
                                <div className="card-location">
                                  <i className="bi bi-geo-alt"></i>
                                  <span className="card-location-text">
                                    Perez and Quezon, Quezon
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* training slot */}
                            <div className="card-slot">
                              <span className="slot-text">Packs</span>
                              <span className="slot-number">35</span>
                            </div>
                          </div>
                          {/* card-wrapper */}
                          <div className="card-wrapper col-12 mb-3">
                            {/* date */}
                            <div className="card-date">
                              <span className="card-month">July</span>
                              <span className="card-date-text">07</span>
                            </div>
                            {/* card training, date, and location */}
                            <div className="card-training-wrapper">
                              <div className="card-training-title">
                                <a href="#" className="card-text-title nav-link">
                                  Retooling on Basic Bookkeeping, RecordKeeping, and
                                  Crafting Resolution
                                </a>
                              </div>
                              <div className="card-dl-range">
                                {/* card date range */}
                                <div className="card-date-range">
                                  <i className="bi bi-calendar3"></i>
                                  <span className="card-range-date">
                                    July 14-17, 2026
                                  </span>
                                </div>
                                <div className="card-location">
                                  <i className="bi bi-geo-alt"></i>
                                  <span className="card-location-text">
                                    Perez and Quezon, Quezon
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* training slot */}
                            <div className="card-slot">
                              <span className="slot-text">Packs</span>
                              <span className="slot-number">35</span>
                            </div>
                          </div>
                          {/* card-wrapper */}
                          <div className="card-wrapper col-12 mb-3">
                            {/* date */}
                            <div className="card-date">
                              <span className="card-month">July</span>
                              <span className="card-date-text">07</span>
                            </div>
                            {/* card training, date, and location */}
                            <div className="card-training-wrapper">
                              <div className="card-training-title">
                                <a href="#" className="card-text-title nav-link">
                                  Retooling on Basic Bookkeeping, RecordKeeping, and
                                  Crafting Resolution
                                </a>
                              </div>
                              <div className="card-dl-range">
                                {/* card date range */}
                                <div className="card-date-range">
                                  <i className="bi bi-calendar3"></i>
                                  <span className="card-range-date">
                                    July 14-17, 2026
                                  </span>
                                </div>
                                <div className="card-location">
                                  <i className="bi bi-geo-alt"></i>
                                  <span className="card-location-text">
                                    Perez and Quezon, Quezon
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* training slot */}
                            <div className="card-slot">
                              <span className="slot-text">Packs</span>
                              <span className="slot-number">35</span>
                            </div>
                          </div>
                          {/* View all button */}
                          <div className="card-button-view-all">
                            <a href="#" className="btn btn-view-all nav-link"
                              >View all trainings
                              <i className="bi bi-arrow-right-short"></i
                            ></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-xl-8">
                    <div className="card training-insights-card h-100">
                      <div className="card-header training-insights-header">
                        <div className="training-insights-heading">
                          <span className="training-insights-icon"
                            ><i className="bi bi-stars"></i
                          ></span>
                          <div>
                            <span className="training-insights-eyebrow"
                              >Community feedback</span
                            >
                            <h5>Training Highlights &amp; Farmer Recommendations</h5>
                            <p>
                              Key takeaways and requests gathered from the latest
                              farmer training sessions.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="card-body training-insights-body">
                        <div className="training-insights-grid">
                          <section className="training-insights-section">
                            <div className="training-insights-section-title">
                              <i className="bi bi-lightning-charge-fill"></i>
                              <h6>Highlights</h6>
                            </div>
                            <ul className="training-insights-list">
                              <li>
                                <span
                                  className="insight-bullet insight-bullet-success"
                                ></span>
                                <div>
                                  <strong
                                    >Practical sessions encouraged sharing</strong
                                  >
                                  <p>
                                    Participants exchanged farm experiences and local
                                    solutions during group activities.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <span
                                  className="insight-bullet insight-bullet-info"
                                ></span>
                                <div>
                                  <strong>Demonstrations made lessons clearer</strong>
                                  <p>
                                    Live examples on feeding, budgeting, and record
                                    keeping were easier for farmers to follow.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <span
                                  className="insight-bullet insight-bullet-warning"
                                ></span>
                                <div>
                                  <strong>Farm planning was a priority topic</strong>
                                  <p>
                                    Many participants asked how to plan expenses,
                                    monitor production, and prepare for seasonal
                                    needs.
                                  </p>
                                </div>
                              </li>
                            </ul>
                          </section>
                          <section
                            className="training-insights-section training-recommendations-section"
                          >
                            <div className="training-insights-section-title">
                              <i className="bi bi-chat-heart-fill"></i>
                              <h6>Farmer Recommendations</h6>
                            </div>
                            <ul className="training-insights-list">
                              <li>
                                <span className="recommendation-number">1</span>
                                <div>
                                  <strong>Extend practical activities</strong>
                                  <p>
                                    Farmers requested more time for hands-on
                                    exercises, especially on feed preparation and farm
                                    records.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <span className="recommendation-number">2</span>
                                <div>
                                  <strong>Share simple reference materials</strong>
                                  <p>
                                    Provide easy-to-read guides, sample forms, and
                                    checklists that can be used at home or on the
                                    farm.
                                  </p>
                                </div>
                              </li>
                              <li>
                                <span className="recommendation-number">3</span>
                                <div>
                                  <strong>Hold barangay-level follow-ups</strong>
                                  <p>
                                    Conduct short follow-up meetings so farmers can
                                    raise concerns after applying the training
                                    lessons.
                                  </p>
                                </div>
                              </li>
                            </ul>
                          </section>
                        </div>
                      </div>
                      <div className="card-footer training-insights-footer">
                        <span
                          ><i className="bi bi-clock-history"></i> Updated from the latest
                          training feedback</span
                        ><a href="#" className="training-insights-link"
                          >Read all feedback <i className="bi bi-arrow-right"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
                {/* sixth row: Evaluation metrics: 1 column on phones, 2 on small screens, 4 on xl screens. */}
                <div className="row sixth-row g-4">
                  <div className="col-12">
                    {/* card result */}
                    <div className="card card-evaluation-result">
                      <div className="card-body">
                        <div className="row">
                          {/* Pre-test Average */}
                          <div className="col-12 col-sm-6 col-xl-3 mb-3 mb-xl-0">
                            <div className="card-wrapper-evaluation">
                              {/* card icon */}
                              <div className="card-icon-evaluation">
                                <i className="bi bi-card-checklist"></i>
                              </div>
                              {/* card details */}
                              <div className="card-details-evaluation">
                                <span className="text-header">Pre-Test Average</span>
                                <span className="text-number">68.54%</span>
                                <span className="text-vs-percentage"
                                  ><i className="bi bi-arrow-up-short"></i> 12.5%
                                  <span className="text-dsb">vs last year</span></span
                                >
                              </div>
                            </div>
                          </div>
                          {/* Post-test average */}
                          <div className="col-12 col-sm-6 col-xl-3 mb-3 mb-xl-0">
                            <div className="card-wrapper-evaluation">
                              {/* card icon */}
                              <div className="card-icon-evaluation">
                                <i className="bi bi-card-checklist"></i>
                              </div>
                              {/* card details */}
                              <div className="card-details-evaluation">
                                <span className="text-header">Post-Test Average</span>
                                <span className="text-number">68.54%</span>
                                <span className="text-vs-percentage"
                                  ><i className="bi bi-arrow-up-short"></i> 12.5%
                                  <span className="text-dsb">vs last year</span></span
                                >
                              </div>
                            </div>
                          </div>
                          {/* Satisfaction rate */}
                          <div className="col-12 col-sm-6 col-xl-3 mb-3 mb-xl-0">
                            <div className="card-wrapper-evaluation">
                              {/* card icon */}
                              <div className="card-icon-evaluation">
                                <i className="bi bi-emoji-laughing-fill"></i>
                              </div>
                              {/* card details */}
                              <div className="card-details-evaluation">
                                <span className="text-header">Satisfaction Rate</span>
                                <span className="text-number">68.54%</span>
                                <span className="text-vs-percentage"
                                  ><i className="bi bi-arrow-up-short"></i> 12.5%
                                  <span className="text-dsb">vs last year</span></span
                                >
                              </div>
                            </div>
                          </div>
                          {/*  */}
                          <div className="col-12 col-sm-6 col-xl-3">
                            <div className="card-wrapper-evaluation">
                              {/* card icon */}
                              <div className="card-icon-evaluation">
                                <i className="bi bi-person-fill"></i>
                              </div>
                              {/* card details */}
                              <div className="card-details-evaluation">
                                <span className="text-header"
                                  >Training Evaluation Rate</span
                                >
                                <span className="text-number">68.54%</span>
                                <span className="text-vs-percentage"
                                  ><i className="bi bi-arrow-up-short"></i> 12.5%
                                  <span className="text-dsb">vs last year</span></span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
      
          {/* Offcanvas side navigation bar in mobile */}
          <div
            className="offcanvas offcanvas-start app-mobile-menu"
            tabIndex="-1"
            id="mobileNavMenu"
            aria-labelledby="mobileNavMenuLabel"
          >
            {/* header */}
            <div className="offcanvas-header">
              {/* Image logo and title */}
              <div className="offcanvas-brand">
                <img
                  src="/assets/logo/DA SAAD LOGO FULL - GREEN TEXT.png"
                  alt="DA-logo"
                  className="image-logo"
                />
                <div className="title-wrapper">
                  <h5 className="offcanvas-title" id="mobileNavMenuLabel">TMIS</h5>
                  <small>Training Management Information System</small>
                </div>
              </div>
              <button
                type="button"
                className="btn offcanvas-close-btn"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <i className="bi bi-x-octagon-fill"></i>
                <span className="close-btn">Close</span>
              </button>
            </div>
            {/* Offcanvas body */}
            <div className="offcanvas-body">
              <div className="mobile-user-panel">
                <img
                  src="/assets/user_profile/user_profile.jpg"
                  alt="User_profile"
                  className="user-profile"
                />
                <div className="mobile-user-name-role">
                  <strong className="user-name">Mark Kinnedy V. Anda</strong>
                  <small className="user-role">System Administrator</small>
                </div>
              </div>
              {/* User list navigation bar */}
              <ul className="mobile-nav">
                <li className="mobile-list-navigation">
                  <a href="dashboard.html" className="nav-link">
                    <i className="bi bi-columns-gap"></i>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li className="mobile-list-navigation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#participantMobile"
                    aria-controls="participantMobile"
                    aria-expanded="false"
                  >
                    <i className="bi bi-people-fill"></i>
                    <span>Participants</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </a>
                  <ul className="collapse mobile-subnav" id="participantMobile">
                    <li className="mobile-list-navigation">
                      <a
                        href="../participants/create/register.html"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#createParticipantMobile"
                        aria-controls="createParticipantMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-plus-circle"></i>
                        <span>Create</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="createParticipantMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-add"></i>
                            <span>Register</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#updateParticipantMobile"
                        aria-controls="updateParticipantMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="updateParticipantMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For review</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For approval</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#detailsParticipantMobile"
                        aria-controls="detailsParticipantMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Details</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="detailsParticipantMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-list-check"></i>
                            <span>All status</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Approved & accepted</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <span>Incomplete</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-x-circle-fill"></i>
                            <span>Inactive</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="mobile-list-navigation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#trainingMobile"
                    aria-controls="trainingMobile"
                    aria-expanded="false"
                  >
                    <i className="bi bi-book-fill"></i>
                    <span>Training</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </a>
                  <ul className="collapse mobile-subnav" id="trainingMobile">
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#createTrainingMobile"
                        aria-controls="createTrainingMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-plus-circle"></i>
                        <span>Create</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul className="collapse mobile-submenu" id="createTrainingMobile">
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-pencil-square"></i>
                            <span>Register</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#updateTrainingMobile"
                        aria-controls="updateTrainingMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul className="collapse mobile-submenu" id="updateTrainingMobile">
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For review</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For approval</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#detailsTrainingMobile"
                        aria-controls="detailsTrainingMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Details</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul className="collapse mobile-submenu" id="detailsTrainingMobile">
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-list-check"></i>
                            <span>All status</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Approved & accepted</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <span>Incomplete</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-x-circle-fill"></i>
                            <span>Inactive</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="mobile-list-navigation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#evaluationMobile"
                    aria-controls="evaluationMobile"
                    aria-expanded="false"
                  >
                    <i className="bi bi-file-earmark-check"></i>
                    <span>Evaluation</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </a>
                  <ul className="collapse mobile-subnav" id="evaluationMobile">
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#createEvaluationMobile"
                        aria-controls="createEvaluationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-plus-circle"></i>
                        <span>Create</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul className="collapse mobile-submenu" id="createEvaluationMobile">
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Pre-test Questionaire</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-file-earmark-text"></i>
                            <span>Post-test Questionaire</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-file-earmark-check"></i>
                            <span>Training Evaluation</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-star-fill"></i>
                            <span>Resource Person Evaluation</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#encodeEvaluationMobile"
                        aria-controls="encodeEvaluationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-pencil-square"></i>
                        <span>Encode</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul className="collapse mobile-submenu" id="encodeEvaluationMobile">
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-pencil-square"></i>
                            <span>Pre-test Evaluation</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-pencil-square"></i>
                            <span>Post-test Evaluation</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-pencil-square"></i>
                            <span>Training Evaluation</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-pencil-square"></i>
                            <span>Resource Person Evaluation</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#updateEvaluationMobile"
                        aria-controls="updateEvaluationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul className="collapse mobile-submenu" id="updateEvaluationMobile">
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For review</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For approval</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#detailsEvaluationMobile"
                        aria-controls="detailsEvaluationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Details</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="detailsEvaluationMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-list-check"></i>
                            <span>All status</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Approved & accepted</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <span>Incomplete</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-x-circle-fill"></i>
                            <span>Inactive</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="mobile-list-navigation">
                  <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="collapse"
                    data-bs-target="#administrationMobile"
                    aria-controls="administrationMobile"
                    aria-expanded="false"
                  >
                    <i className="bi bi-sliders"></i>
                    <span>Administration</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </a>
                  <ul className="collapse mobile-subnav" id="administrationMobile">
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#createAdministrationMobile"
                        aria-controls="createAdministrationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-plus-circle"></i>
                        <span>Create</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="createAdministrationMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-pencil-square"></i>
                            <span>Register</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#updateAdministrationMobile"
                        aria-controls="updateAdministrationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Update</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="updateAdministrationMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-person-fill-check"></i>
                            <span>For approval</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="mobile-list-navigation">
                      <a
                        href="#"
                        className="nav-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#detailsAdministrationMobile"
                        aria-controls="detailsAdministrationMobile"
                        aria-expanded="false"
                      >
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Details</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                      </a>
                      <ul
                        className="collapse mobile-submenu"
                        id="detailsAdministrationMobile"
                      >
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-list-check"></i>
                            <span>All status</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-check-circle-fill"></i>
                            <span>Approved & accepted</span>
                          </a>
                        </li>
                        <li className="mobile-subnav-panel-navigation">
                          <a href="#" className="nav-link">
                            <i className="bi bi-x-circle-fill"></i>
                            <span>Inactive</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="mobile-list-navigation">
                  <a href="#my-profile" className="nav-link">
                    <i className="bi bi-person-circle"></i>
                    <span>Profile</span>
                  </a>
                </li>
                <li className="mobile-list-navigation">
                  <a href="#my-logs" className="nav-link">
                    <i className="bi bi-journal-text"></i>
                    <span>Logs</span>
                  </a>
                </li>
                <li className="mobile-list-navigation">
                  <a href="#settings" className="nav-link">
                    <i className="bi bi-gear"></i>
                    <span>Settings</span>
                  </a>
                </li>
                <li className="mobile-list-navigation">
                  <a href="#signout" className="nav-link sign-out-item">
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
      
          {/* Dashboard report modal */}
          <div
            className="modal fade"
            id="dashboardReportModal"
            tabIndex="-1"
            aria-labelledby="dashboardReportModalTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable dashboard-report-dialog"
            >
              <div className="modal-content dashboard-report-modal">
                <div className="modal-header dashboard-report-header">
                  <div className="dashboard-report-heading">
                    <span className="dashboard-report-icon"
                      ><i id="dashboardReportIcon" className="bi bi-table"></i
                    ></span>
                    <div>
                      <span className="dashboard-report-eyebrow">Dashboard details</span>
                      <h5 id="dashboardReportModalTitle">Report details</h5>
                      <p id="dashboardReportDescription">
                        Review, search, and export the detailed records.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn dashboard-report-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="modal-body dashboard-report-body">
                  <div className="dashboard-report-summary">
                    <div>
                      <span>Report total</span>
                      <strong id="dashboardReportTotal">0</strong>
                    </div>
                    <p>
                      Use the search field to narrow results, or export the records in
                      your preferred format.
                    </p>
                  </div>
                  <div className="dashboard-report-table-wrap">
                    <table
                      id="dashboardReportTable"
                      className="display dashboard-report-table w-100"
                    >
                      <thead></thead>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer dashboard-report-footer">
                  <span
                    ><i className="bi bi-shield-check"></i> Dashboard reporting data</span
                  >
                  <button
                    type="button"
                    className="btn dashboard-report-dismiss"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
      
          {/* Notification detail modal */}
          <div
            className="modal fade"
            id="notificationDetailModal"
            aria-labelledby="notificationDetailModalLabel"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-dialog-scrollable notification-detail-dialog"
            >
              <div className="modal-content notification-detail-modal">
                <div className="modal-header notification-detail-header">
                  <span className="notification-detail-icon"
                    ><i className="bi bi-bell-fill"></i
                  ></span>
                  <button
                    type="button"
                    className="btn btn-modal"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="bi bi-x-octagon"></i>
                  </button>
                </div>
                <div className="modal-body notification-detail-body">
                  <div className="notification-detail-meta">
                    <span id="notificationDetailType">Approval required</span>
                    <time id="notificationDetailTime">Today, 9:20 PM</time>
                  </div>
                  <h5 id="notificationDetailModalLabel">
                    Training proposal review needed
                  </h5>
                  <p id="notificationDetailDescription"></p>
                </div>
                <div className="modal-footer notification-detail-footer">
                  <button
                    type="button"
                    className="btn notification-detail-dismiss"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn notification-detail-action"
                    id="notificationDetailAction"
                  >
                    Review proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
    </>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<Dashboard />);
