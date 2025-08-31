document.addEventListener("DOMContentLoaded", () => {
  const addCourseForm = document.getElementById("add-course-form");

  if (addCourseForm) {
    addCourseForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const courseTitle = document.getElementById("course-title").value;
      const courseDescription =
        document.getElementById("course-description").value;
      const courseImage = document.getElementById("course-image").files[0];
      const user = auth.currentUser;

      if (user && courseImage) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`course-images/${courseImage.name}`);
        await imageRef.put(courseImage);
        const imageUrl = await imageRef.getDownloadURL();

        await db.collection("courses").add({
          title: courseTitle,
          description: courseDescription,
          imageUrl: imageUrl,
          teacherId: user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        alert("Course created successfully!");
        window.location.href = "teacher.html";
      }
    });
  }
});
