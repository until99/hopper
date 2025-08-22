function isUserAuthenticated() {
  const authStatus = localStorage.getItem("isAuthenticated");
  return authStatus === "true";
}

function setUserAuthenticated(value) {
  localStorage.setItem("isAuthenticated", value.toString());
}

export default {
  isUserAuthenticated,
  setUserAuthenticated,
};
