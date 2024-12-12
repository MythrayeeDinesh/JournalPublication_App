import React, { useEffect, useState } from "react";
import "../vendors/typicons/typicons.css";
import "../vendors/css/vendor.bundle.base.css";
import "../css/vertical-layout-light/style.css";
import JournalSubmission from './JournalSubmission';
import Menu from "./Menu";
import { Route, Routes } from 'react-router-dom';

const MainComponent=()=>{
  const [selectedMenu, setSelectedMenu] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Retrieve the role from session storage
    const savedRole = sessionStorage.getItem('role');
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);


  // Function to set the selected menu
  const handleSelectMenu = (menu) => {
    console.log("Menu selected:", menu); // For debugging purposes
    setSelectedMenu(menu);
  };

    return(<>


<div className="container-scroller">
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="navbar-brand-wrapper d-flex justify-content-center">
        <div className="navbar-brand-inner-wrapper d-flex justify-content-between align-items-center w-100">
          <a className="navbar-brand brand-logo" href="../../index.html"><img src="../../images/logo.svg" alt="logo"/></a>
          <a className="navbar-brand brand-logo-mini" href="../../index.html"><img src="../../images/logo-mini.svg" alt="logo"/></a>
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span className="typcn typcn-th-menu"></span>
          </button>
        </div>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <ul className="navbar-nav mr-lg-2">
          <li className="nav-item nav-profile dropdown">
            <a className="nav-link"  data-toggle="dropdown" id="profileDropdown">
              <img src="../../images/faces/face5.jpg" alt="profile"/>
              <span className="nav-profile-name">Eugenia Mullins</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
              <a className="dropdown-item">
                <i className="typcn typcn-cog-outline text-primary"></i>
                Settings
              </a>
              <a className="dropdown-item">
                <i className="typcn typcn-eject text-primary"></i>
                Logout
              </a>
            </div>
          </li>
          <li className="nav-item nav-user-status dropdown">
              <p className="mb-0">Last login was 23 hours ago.</p>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-date dropdown">
            <a className="nav-link d-flex justify-content-center align-items-center" href="javascript:;">
              <h6 className="date mb-0">Today : Mar 23</h6>
              <i className="typcn typcn-calendar"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown"  data-toggle="dropdown">
              <i className="typcn typcn-cog-outline mx-0"></i>
              <span className="count"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="messageDropdown">
              <p className="mb-0 font-weight-normal float-left dropdown-header">Messages</p>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                    <img src="../../images/faces/face4.jpg" alt="image" className="profile-pic"></img>
                </div>
                <div className="preview-item-content flex-grow">
                  <h6 className="preview-subject ellipsis font-weight-normal">David Grey
                  </h6>
                  <p className="font-weight-light small-text text-muted mb-0">
                    The meeting is cancelled
                  </p>
                </div>
              </a>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                    <img src="../../images/faces/face2.jpg" alt="image" className="profile-pic"></img>
                </div>
                <div className="preview-item-content flex-grow">
                  <h6 className="preview-subject ellipsis font-weight-normal">Tim Cook
                  </h6>
                  <p className="font-weight-light small-text text-muted mb-0">
                    New product launch
                  </p>
                </div>
              </a>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                    <img src="../../images/faces/face3.jpg" alt="image" className="profile-pic"></img>
                </div>
                <div className="preview-item-content flex-grow">
                  <h6 className="preview-subject ellipsis font-weight-normal"> Johnson
                  </h6>
                  <p className="font-weight-light small-text text-muted mb-0">
                    Upcoming board meeting
                  </p>
                </div>
              </a>
            </div>
          </li>
          <li className="nav-item dropdown mr-0">
            <a className="nav-link count-indicator dropdown-toggle d-flex align-items-center justify-content-center" id="notificationDropdown"  data-toggle="dropdown">
              <i className="typcn typcn-bell mx-0"></i>
              <span className="count"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
              <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-success">
                    <i className="typcn typcn-info mx-0"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <h6 className="preview-subject font-weight-normal">Application Error</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">
                    Just now
                  </p>
                </div>
              </a>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-warning">
                    <i className="typcn typcn-cog-outline mx-0"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <h6 className="preview-subject font-weight-normal">Settings</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">
                    Private message
                  </p>
                </div>
              </a>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-info">
                    <i className="typcn typcn-user mx-0"></i> 
                  </div>
                </div>
                <div className="preview-item-content">
                  <h6 className="preview-subject font-weight-normal">New user registration</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">
                    2 days ago
                  </p>
                </div>
              </a>
            </div>
          </li>
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
          <span className="typcn typcn-th-menu"></span>
        </button>
      </div>
    </nav>
    <div className="container-fluid page-body-wrapper">
      <div className="theme-setting-wrapper">
        <div id="settings-trigger"><i className="typcn typcn-cog-outline"></i></div>
        <div id="theme-settings" className="settings-panel">
          <i className="settings-close typcn typcn-times"></i>
          <p className="settings-heading">SIDEBAR SKINS</p>
          <div className="sidebar-bg-options selected" id="sidebar-light-theme"><div className="img-ss rounded-circle bg-light border mr-3"></div>Light</div>
          <div className="sidebar-bg-options" id="sidebar-dark-theme"><div className="img-ss rounded-circle bg-dark border mr-3"></div>Dark</div>
          <p className="settings-heading mt-2">HEADER SKINS</p>
          <div className="color-tiles mx-0 px-4">
            <div className="tiles success"></div>
            <div className="tiles warning"></div>
            <div className="tiles danger"></div>
            <div className="tiles info"></div>
            <div className="tiles dark"></div>
            <div className="tiles default"></div>
          </div>
        </div>
      </div>
      <div id="right-sidebar" className="settings-panel">
        <i className="settings-close typcn typcn-times"></i>
        <ul className="nav nav-tabs" id="setting-panel" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="todo-tab" data-toggle="tab" href="#todo-section" role="tab" aria-controls="todo-section" aria-expanded="true">TO DO LIST</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="chats-tab" data-toggle="tab" href="#chats-section" role="tab" aria-controls="chats-section">CHATS</a>
          </li>
        </ul>
        <div className="tab-content" id="setting-content">
          <div className="tab-pane fade show active scroll-wrapper" id="todo-section" role="tabpanel" aria-labelledby="todo-section">
            <div className="add-items d-flex px-3 mb-0">
              <form className="form w-100">
                <div className="form-group d-flex">
                  <input type="text" className="form-control todo-list-input" placeholder="Add To-do"></input>
                  <button type="submit" className="add btn btn-primary todo-list-add-btn" id="add-task">Add</button>
                </div>
              </form>
            </div>
            <div className="list-wrapper px-3">
              <ul className="d-flex flex-column-reverse todo-list">
                <li>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="checkbox" type="checkbox"></input>
                      Team review meeting at 3.00 PM
                    </label>
                  </div>
                  <i className="remove typcn typcn-delete-outline"></i>
                </li>
                <li>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="checkbox" type="checkbox"></input>
                      Prepare for presentation
                    </label>
                  </div>
                  <i className="remove typcn typcn-delete-outline"></i>
                </li>
                <li>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="checkbox" type="checkbox"></input>
                      Resolve all the low priority tickets due today
                    </label>
                  </div>
                  <i className="remove typcn typcn-delete-outline"></i>
                </li>
                <li className="completed">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="checkbox" type="checkbox" ></input>
                      Schedule meeting for next week
                    </label>
                  </div>
                  <i className="remove typcn typcn-delete-outline"></i>
                </li>
                <li className="completed">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="checkbox" type="checkbox" ></input>
                      Project review
                    </label>
                  </div>
                  <i className="remove typcn typcn-delete-outline"></i>
                </li>
              </ul>
            </div>
            <div className="events py-4 border-bottom px-3">
              <div className="wrapper d-flex mb-2">
                <i className="typcn typcn-media-record-outline text-primary mr-2"></i>
                <span>Feb 11 2018</span>
              </div>
              <p className="mb-0 font-weight-thin text-gray">Creating component page</p>
              <p className="text-gray mb-0">build a js based app</p>
            </div>
            <div className="events pt-4 px-3">
              <div className="wrapper d-flex mb-2">
                <i className="typcn typcn-media-record-outline text-primary mr-2"></i>
                <span>Feb 7 2018</span>
              </div>
              <p className="mb-0 font-weight-thin text-gray">Meeting with Alisa</p>
              <p className="text-gray mb-0 ">Call Sarah Graves</p>
            </div>
          </div>
          
          <div className="tab-pane fade" id="chats-section" role="tabpanel" aria-labelledby="chats-section">
            <div className="d-flex align-items-center justify-content-between border-bottom">
              <p className="settings-heading border-top-0 mb-3 pl-3 pt-0 border-bottom-0 pb-0">Friends</p>
              <small className="settings-heading border-top-0 mb-3 pt-0 border-bottom-0 pb-0 pr-3 font-weight-normal">See All</small>
            </div>
            <ul className="chat-list">
              <li className="list active">
                <div className="profile"><img src="../../images/faces/face1.jpg" alt="image"></img><span className="online"></span></div>
                <div className="info">
                  <p>Thomas Douglas</p>
                  <p>Available</p>
                </div>
                <small className="text-muted my-auto">19 min</small>
              </li>
              <li className="list">
                <div className="profile"><img src="../../images/faces/face2.jpg" alt="image"></img><span className="offline"></span></div>
                <div className="info">
                  <div className="wrapper d-flex">
                    <p>Catherine</p>
                  </div>
                  <p>Away</p>
                </div>
                <div className="badge badge-success badge-pill my-auto mx-2">4</div>
                <small className="text-muted my-auto">23 min</small>
              </li>
              <li className="list">
                <div className="profile"><img src="../../images/faces/face3.jpg" alt="image"></img><span className="online"></span></div>
                <div className="info">
                  <p>Daniel Russell</p>
                  <p>Available</p>
                </div>
                <small className="text-muted my-auto">14 min</small>
              </li>
              <li className="list">
                <div className="profile"><img src="../../images/faces/face4.jpg" alt="image"></img><span className="offline"></span></div>
                <div className="info">
                  <p>James Richardson</p>
                  <p>Away</p>
                </div>
                <small className="text-muted my-auto">2 min</small>
              </li>
              <li className="list">
                <div className="profile"><img src="../../images/faces/face5.jpg" alt="image"></img><span className="online"></span></div>
                <div className="info">
                  <p>Madeline Kennedy</p>
                  <p>Available</p>
                </div>
                <small className="text-muted my-auto">5 min</small>
              </li>
              <li className="list">
                <div className="profile"><img src="../../images/faces/face6.jpg" alt="image"></img><span className="online"></span></div>
                <div className="info">
                  <p>Sarah Graves</p>
                  <p>Available</p>
                </div>
                <small className="text-muted my-auto">47 min</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
     
      <Menu onSelectMenu={handleSelectMenu} />
<div className="main-panel" style={{ width: '1276px' }}>

      <div className="content-wrapper">
        <Routes>
          <Route path="/journal-submission" element={<JournalSubmission />} />
          {/* Add other routes as needed */}
        </Routes>
      

        <footer className="footer">
            <div className="card">
                <div className="card-body">
                    <div className="d-sm-flex justify-content-center justify-content-sm-between">
                        <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2020 <a href="https://www.bootstrapdash.com/" className="text-muted" target="_blank">Bootstrapdash</a>. All rights reserved.</span>
                        <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">Free <a href="https://www.bootstrapdash.com/" className="text-muted" target="_blank">Bootstrap dashboard</a> templates from Bootstrapdash.com</span>
                    </div>
                </div>    
            </div>        
        </footer>
      </div>
    </div>
  </div>
  </div>
  <script src="../../vendors/js/vendor.bundle.base.js"></script>
  <script src="../../js/off-canvas.js"></script>
  <script src="../../js/hoverable-collapse.js"></script>
  <script src="../../js/template.js"></script>
  <script src="../../js/settings.js"></script>
  <script src="../../js/todolist.js"></script>
  <script src="../../vendors/typeahead.js/typeahead.bundle.min.js"></script>
  <script src="../../vendors/select2/select2.min.js"></script>
  <script src="../../js/file-upload.js"></script>
  <script src="../../js/typeahead.js"></script>
  <script src="../../js/select2.js"></script>



    </>
    );
}

export default MainComponent;