import { recipes } from "../data/recipes.js";
import { List } from "./create_elements/classe_List.js";
import { Tag } from "./create_elements/classe_Tag.js";
import { displayRecipes } from "./display_elements/displayRecipes.js";
import { step } from "./index.js";

/** -------------------------------------------------- ALGO DE LA BARRE DE RECHERCHE -------------------------------------------------- */

export function algoSearchBar() {
  const domSectionResult = document.getElementById("result-section");
  const noResult = document.getElementById("no-result");
  const inputSearchContent = document
    .getElementById("searchbar")
    .value.toLowerCase()
    .replace(/\s/g, "");
  const tagArray = Array.from(
    document.getElementById("search-tags").childNodes
  );

  /** ---------- SCRIPT DE LA FONCTION ---------- */
  if (inputSearchContent.length >= 3) {
    let result = [];
    for (const recipe of step.filteredRecipes) {
      const match = new SearchIn().findIn(inputSearchContent, recipe);
      if (match) {
        result.push(recipe);
      }
    }
    step.searchedRecipes = result;

    if (step.searchedRecipes.length != 0) {
      domSectionResult.innerHTML = ""; // Vide le DOM de la galerie
      displayRecipes(step.searchedRecipes);
    } else {
      displayRecipes(step.searchedRecipes);
      noResult.classList.remove("hidden");
    }
    step.currentTabRecipes = step.searchedRecipes;
  } else if (inputSearchContent.length < 3 && tagArray.length === 0) {
    noResult.classList.add("hidden");
    step.currentTabRecipes = recipes;
    step.searchedRecipes = recipes;
    displayRecipes(recipes);
  } else {
    step.searchedRecipes = recipes;
    step.currentTabRecipes = recipes;
    algoTag();
  }
}

/** -------------------------------------------------- ALGO DE LA BARRE DE RECHERCHE PAR TAG -------------------------------------------------- */
export function algoSearchTag(element) {
  const inputListContent = element.target.value.toLowerCase();
  const category = element.target.dataset.type;
  const list = document.getElementById(`${category}-list`);

  const tagsList = Array.from(document.querySelectorAll(`.${category}-item`));
  let newList = [];
  let newListArray = [];

  /** ---------- SCRIPT DE LA FONCTION ---------- */
  if (inputListContent.length != 0) {
    if (inputListContent.length >= 3) {
      tagsList.forEach((item) => {
        const itemList = item.dataset.name.toLowerCase();
        const findList = itemList.includes(inputListContent);
        if (findList == true) {
          newList.push(itemList);
          newListArray.push(item); // Création d'un tableau avec les items des listes
          list.innerText = "";
          newList.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            li.classList.add(`${category}-item`);
            li.setAttribute("data-category", category);
            li.setAttribute("data-name", item);
            list.appendChild(li);
            li.addEventListener("click", (e) => {
              new Tag().createTag(e); // Appel de la classe Tag      Ajoute un tag
              new List().closeList(e);
            });
          });
        }
      });
    } else {
      new List().displayList(recipes);
    }
  }
}

/** -------------------------------------------------- ALGO DE RECHERCHE PAR TAG -------------------------------------------------- */
export function algoTag() {
  const arrayTag = Array.from(
    document.getElementById("search-tags").childNodes
  );

  /** ---------- SCRIPT DE LA FONCTION ---------- */
  if (arrayTag.length != 0) {
    arrayTag.forEach((tag) => {
      filterMatch(tag);
    });
    displayRecipes(step.currentTabRecipes);
    step.filteredRecipes = step.currentTabRecipes;
    step.currentTabRecipes = step.searchedRecipes;
  } else {
    step.filteredRecipes = recipes;
    algoSearchBar();
  }
}

/* -------------------------------------------------- CLASSE de recherche par type de data -------------------------------------------------- */
class SearchIn {
  constructor(element, inputSearchContent) {
    this.element = element;
    this.inputSearchContent = inputSearchContent;
  }
  searchInTitle() {
    return this.element.name.toLowerCase().includes(this.inputSearchContent);
  }
  searchInDescription() {
    return this.element.description
      .toLowerCase()
      .includes(this.inputSearchContent);
  }
  searchInIngredients() {
    return this.element.ingredients.some((element) => {
      return (
        element.ingredient.toLowerCase().includes(this.inputSearchContent) ===
        true
      );
    });
  }
  searchInAppliances() {
    return this.element.appliance
      .toLowerCase()
      .includes(this.inputSearchContent);
  }
  searchInUstensils() {
    return this.element.ustensils.some((element) => {
      return element.toLowerCase().includes(this.inputSearchContent);
    });
  }

  findIn(inputSearchContent, element) {
    const find = new SearchIn(element, inputSearchContent);
    find.searchInTitle();
    find.searchInDescription();
    find.searchInIngredients();

    if (
      find.searchInTitle() ||
      find.searchInDescription() ||
      find.searchInIngredients() == true
    ) {
      return true;
    } else {
      return false;
    }
  }
}

/* -------------------------------------------------- Contrôle de la recherche -------------------------------------------------- */
function filterMatch(tag) {
  const filterType = tag.dataset.category;
  const tagName = tag.dataset.name.toLowerCase();
  switch (filterType) {
    case "ingredients":
      step.currentTabRecipes = step.currentTabRecipes.filter((element) => {
        const match = new SearchIn(element, tagName);
        match.searchInIngredients();
        if (match.searchInIngredients() == true) {
          return true;
        }
      });
      break;
    case "appliances":
      step.currentTabRecipes = step.currentTabRecipes.filter((element) => {
        const match = new SearchIn(element, tagName);
        match.searchInAppliances();
        if (match.searchInAppliances() == true) {
          return true;
        }
      });
      break;
    case "ustensils":
      step.currentTabRecipes = step.currentTabRecipes.filter((element) => {
        const match = new SearchIn(element, tagName);
        match.searchInUstensils();
        if (match.searchInUstensils() == true) {
          return true;
        }
      });
      break;
  }
}
