function isUserAuthenticated() {
  const authStatus = localStorage.getItem("isAuthenticated");
  return authStatus === "true";
}

function setUserAuthenticated(value) {
  localStorage.setItem("isAuthenticated", value.toString());

  window.dispatchEvent(
    new CustomEvent("authStatusChanged", {
      detail: { isAuthenticated: value },
    }),
  );
}

export default {
  isUserAuthenticated,
  setUserAuthenticated,
};
