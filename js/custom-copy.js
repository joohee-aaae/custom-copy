const STORAGE_KEY = "CUSTOM_COPY_BY_AAAE";
let template, listSection, clipboardInstance;

const getStorageData = () => {
  const rawData = window.localStorage.getItem(STORAGE_KEY) || "[]";

  return JSON.parse(rawData) || [];
};

const setStorageData = (arr) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
};

const addItem = (text) => {
  const prevList = getStorageData();
  const newList = [
    ...prevList,
    { text, key: `${Date.now()}_${prevList.length}` },
  ];

  setStorageData(newList);
};

const removeItem = (strKey) => {
  const prevList = getStorageData();
  const newList = prevList.filter((i) => i.key !== strKey);

  setStorageData(newList);
};

const renderList = () => {
  const list = getStorageData();

  listSection.innerHTML = list
    .map((item, idx) => {
      return template
        .replaceAll("{{text}}", item.text)
        .replace("{{key}}", item.key || idx);
    })
    .join("");
};

const handleClickAddSection = (e) => {
  const isButton = e.target.tagName.toLowerCase() === "button";
  const input = e.currentTarget.querySelector("input");
  const text = input.value;

  if (isButton && text !== "") {
    addItem(text);
    renderList();
    input.value = "";
  }
};

const handleClickListSection = (e) => {
  const isButton = e.target.tagName.toLowerCase() === "button";
  const isDelete = isButton && e.target.classList.contains("delete");
  const isCopy = isButton && e.target.classList.contains("copy");
  const list = e.target.parentElement;
  const key = list.getAttribute("data-key");

  if (isCopy) {
    // use clipboard.js
    return;
  }

  if (isDelete) {
    removeItem(key);
    renderList();
  }
};

const init = () => {
  const addSection = document.querySelector("#add");

  clipboardInstance = new ClipboardJS("button.copy");
  listSection = document.querySelector("#list");
  template = listSection.querySelector("script[type='template']").innerText;

  renderList();

  addSection.addEventListener("click", handleClickAddSection);
  listSection.addEventListener("click", handleClickListSection);
  clipboardInstance.on("success", (e) => {
    window.alert(`${e.text} copy`);
  });
};

document.addEventListener("DOMContentLoaded", init);
