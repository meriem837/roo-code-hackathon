document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const getStartedBtn = document.getElementById("get-started-btn");
  const userAvatar = document.getElementById("user-avatar");
  const userDropdown = document.getElementById("user-dropdown");
  const searchIcon = document.querySelector(".search-btn");
  const mainContent = document.querySelector("main");
  const searchResults = document.getElementById("search-results");
  const filterContainer = document.querySelector(".filter-container");

  if (loginBtn) {
    const handleRoleSelection = (action) => {
      let role = "";
      while (role !== "teacher" && role !== "student") {
        role = prompt("Are you a 'teacher' or a 'student'?").toLowerCase();
        if (role !== "teacher" && role !== "student") {
          alert(
            "This question is important. Please answer with 'teacher' or 'student'."
          );
        }
      }
      window.location.href = `${role}-${action}.html`;
    };

    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRoleSelection("login");
    });

    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRoleSelection("register");
    });

    getStartedBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleRoleSelection("register");
    });
  }

  if (userAvatar) {
    userAvatar.addEventListener("click", () => {
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", (e) => {
      if (!userAvatar.contains(e.target)) {
        userDropdown.style.display = "none";
      }
    });
  }

  if (searchIcon) {
    searchIcon.addEventListener("click", () => {
      if (mainContent) mainContent.style.display = "none";
      if (searchResults) searchResults.style.display = "block";
      if (filterContainer) filterContainer.style.display = "flex";

      // Hide other sections
      const trendingCourses = document.querySelector(".trending-courses");
      if (trendingCourses) trendingCourses.style.display = "none";
      const imageDescriptionSection = document.querySelector(
        ".image-description-section"
      );
      if (imageDescriptionSection)
        imageDescriptionSection.style.display = "none";
    });
  }
});
