class WishlistItem {

    constructor(description, link, type = "default") {

        this.description = description;
        this.link = link;
        this.type = type;

    }

}

const wishlist = [

    new WishlistItem(
        "Sony WH-1000XM6 headphones",
        "https://example.com",
        "favourite"
    ),

    new WishlistItem(
        "The Name of the Rose",
        "https://example.com"
    ),

    new WishlistItem(
        "A nice coffee",
        "https://example.com",
        "favourite"
    ),

    new WishlistItem(
        "A board game",
        "https://example.com"
    )

];

function displayWishlist() {

    const container =
        document.querySelector("#wishlist-container");

    container.innerHTML = "";

    const sortedWishlist = [...wishlist].sort((a, b) => {

        if (a.type === "favourite" && b.type !== "favourite") {
            return -1;
        }

        if (a.type !== "favourite" && b.type === "favourite") {
            return 1;
        }

        return 0;

    });


    for (const item of sortedWishlist) {

        const card = createCard(item);

        container.appendChild(card);

    }

}

function createCard(item) {

    const card = document.createElement("article");

    card.classList.add("wishlist-card");


    if (item.type === "favourite") {

        card.classList.add("favourite");

    } else {

        card.classList.add("default");

    }


    const menuButton =
        document.createElement("button");

    menuButton.classList.add("menu-button");

    menuButton.textContent = "⋮";


    const description =
        document.createElement("div");

    description.classList.add("item-description");

    description.textContent = item.description;


    const link =
        document.createElement("a");

    link.classList.add("item-link");

    link.textContent = item.link;

    link.href = item.link;

    link.target = "_blank";


    card.appendChild(menuButton);

    card.appendChild(description);

    card.appendChild(link);


    return card;

}

const params = new URLSearchParams(window.location.search);

const language = params.get("lang");

const title = document.querySelector("#title");

displayWishlist();

const addButton = 
    document.querySelector("#add-button");

const addPopup = 
    document.querySelector("#add-popup");

const closePopup = 
    document.querySelector("#close-popup");

addButton.addEventListener("click", () => {

    addPopup.classList.remove("hidden");

});

const itemInput =
    document.querySelector("#item-input");

const linkInput =
    document.querySelector("#link-input");

const favouriteInput =
    document.querySelector("#favourite-input");

closePopup.addEventListener("click", () => {

    addPopup.classList.add("hidden");

    itemInput.value = "";
    linkInput.value = "";
    favouriteInput.checked = false;

});

const itemLabel =
    document.querySelector("#item-label");

const linkLabel =
    document.querySelector("#link-label");

const favouriteLabel =
    document.querySelector("#favourite-label");

const confirmAdd =
    document.querySelector("#confirm-add");


if (language === "ru") {

    title.textContent = "Вишлист";

    itemLabel.textContent = "Товар";
    linkLabel.textContent = "Ссылка";
    favouriteLabel.textContent = "Фаворит";
    confirmAdd.textContent = "Добавить";

} else {

    title.textContent = "Wishlist";

    itemLabel.textContent = "Item";
    linkLabel.textContent = "Link";
    favouriteLabel.textContent = "Favourite";
    confirmAdd.textContent = "Add";

}