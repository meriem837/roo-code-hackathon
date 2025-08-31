document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackPosts = document.getElementById("feedback-posts");
  const feedbackFab = document.getElementById("feedback-fab");
  const feedbackDropupContainer = document.getElementById(
    "feedback-dropup-container"
  );
  const studentFabContainer = document.getElementById(
    "student-feedback-fab-container"
  );
  const teacherHeading = document.getElementById("teacher-feedback-heading");
  const mainHeading = document.getElementById("page-main-heading");
  const dashboardLink = document.getElementById("dashboard-link");
  const closeFeedbackFormBtn = document.getElementById("close-feedback-form");

  if (feedbackFab) {
    feedbackFab.addEventListener("click", () => {
      feedbackDropupContainer.style.display =
        feedbackDropupContainer.style.display === "block" ? "none" : "block";
    });
  }

  if (closeFeedbackFormBtn) {
    closeFeedbackFormBtn.addEventListener("click", () => {
      if (feedbackDropupContainer) {
        feedbackDropupContainer.style.display = "none";
      }
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const courseTag = document.getElementById("course-tag").value;
      const feedbackText = document.getElementById("feedback-text").value;
      const user = auth.currentUser;

      if (user) {
        const userRef = db.collection("users").doc(user.uid);
        const userSnap = await userRef.get();
        const userData = userSnap.data();

        await db.collection("feedback").add({
          userId: user.uid,
          username: userData.username,
          photoURL: userData.photoURL || "",
          course: courseTag,
          text: feedbackText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        feedbackForm.reset();
        if (feedbackDropupContainer) {
          feedbackDropupContainer.style.display = "none";
        }
        loadFeedback();
      }
    });
  }

  const loadFeedback = async () => {
    if (!feedbackPosts) return;
    feedbackPosts.innerHTML = "";
    const feedbackQuery = await db
      .collection("feedback")
      .orderBy("createdAt", "desc")
      .get();
    const user = auth.currentUser;
    feedbackQuery.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement("div");
      postElement.classList.add("blog-post");

      let avatarHTML = "";
      if (post.photoURL) {
        avatarHTML = `<img src="${post.photoURL}" alt="${post.username}" class="user-avatar-image" style="width: 50px; height: 50px; border-radius: 50%;">`;
      } else {
        avatarHTML = `<div class="user-avatar-initial" style="width: 50px; height: 50px; border-radius: 50%;">${post.username
          .charAt(0)
          .toUpperCase()}</div>`;
      }

      let deleteButtonHTML = "";
      if (user && user.uid === post.userId) {
        deleteButtonHTML = `<button class="delete-feedback-btn" data-id="${doc.id}">Delete</button>`;
      }

      postElement.innerHTML = `
        <div class="blog-post-content">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              ${avatarHTML}
              <div>
                <h3 style="margin: 0;">${post.username}</h3>
                <p style="margin: 0; color: #777;">Course: ${post.course}</p>
              </div>
            </div>
            ${deleteButtonHTML}
          </div>
          <p>${post.text}</p>
        </div>
      `;
      feedbackPosts.appendChild(postElement);
    });

    const deleteButtons = document.querySelectorAll(".delete-feedback-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const docId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this feedback?")) {
          await db.collection("feedback").doc(docId).delete();
          loadFeedback();
        }
      });
    });
  };

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      let userSnap = await db.collection("users").doc(user.uid).get();
      if (!userSnap.exists) {
        const newUser = {
          email: user.email,
          username: user.email.split("@")[0],
          role: "student",
        };
        await db.collection("users").doc(user.uid).set(newUser);
        userSnap = await db.collection("users").doc(user.uid).get();
      }
      const userData = userSnap.data();

      if (dashboardLink) {
        if (userData.role === "student") {
          dashboardLink.href = "student.html";
        } else if (userData.role === "teacher") {
          dashboardLink.href = "teacher.html";
        }
      }

      if (studentFabContainer) {
        if (userData.role === "student" || userData.role === "teacher") {
          studentFabContainer.style.display = "block";
        }
      }

      if (mainHeading) {
        mainHeading.style.display = "block";
      }
      if (teacherHeading) {
        if (userData.role === "teacher") {
          teacherHeading.style.display = "block";
        } else {
          teacherHeading.style.display = "none";
        }
      }
    }
    loadFeedback();
  });
});
