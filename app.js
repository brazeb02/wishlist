const supabaseUrl =
    "https://pigluavczwmcqavlwguf.supabase.co";

const supabaseKey =
    "sb_publishable_hhCBM9JacULXYTTO_1Sdxg_uxYyppYy";


const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );

async function testDatabase() {

    const { data, error } =
        await supabaseClient
            .from("wishlist")
            .select("*");


    console.log(data);

    console.log(error);

}


testDatabase();

class WishlistItem {

    constructor(id, description, link, type = "default") {

        this.id = id;
        this.description = description;
        this.link = link;
        this.type = type;

    }

}

async function loadWishlist() {

    const { data, error } =
        await supabaseClient
            .from("wishlist")
            .select("*");


    if (error) {

        console.error(
            "Error loading wishlist:",
            error
        );

        return;

    }


    wishlist = data.map((item) => {

    return new WishlistItem(
        item.id,
        item.description,
        item.link,
        item.type
    );

});


    displayWishlist();

}

let wishlist = [];

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

    const menu =
        document.createElement("div");

    menu.classList.add("item-menu");

    menuButton.addEventListener("click", () => {

        const allMenus =
            document.querySelectorAll(".item-menu");

        allMenus.forEach((otherMenu) => {

            if (otherMenu !== menu) {

                otherMenu.classList.remove("visible");

            }

        });


    menu.classList.toggle("visible");

    });


    const deleteButton =
        document.createElement("button");

    deleteButton.classList.add("menu-option");

    deleteButton.textContent =
        language === "ru"
            ? "Удалить"
            : "Delete";

    deleteButton.addEventListener("click", async () => {

        const { error } =
            await supabaseClient
                .from("wishlist")
                .delete()
                .eq("id", item.id);


        if (error) {

            console.error(
                "Error deleting wishlist item:",
                error
            );

            return;

        }


        await loadWishlist();

    });        


    const favouriteButton =
        document.createElement("button");

    favouriteButton.classList.add("menu-option");


    if (item.type === "favourite") {

        favouriteButton.textContent =
            language === "ru"
                ? "Убрать из фаворитов"
                : "Remove from favourites";

    } else {

        favouriteButton.textContent =
            language === "ru"
                ? "Добавить в фавориты"
                : "Add to favourites";

    }

    favouriteButton.addEventListener("click", async () => {

        const newType =
            item.type === "favourite"
                ? "default"
                : "favourite";


        const { error } =
            await supabaseClient
                .from("wishlist")
                .update({
                    type: newType
                })
                .eq("id", item.id);


        if (error) {

            console.error(
                "Error changing wishlist item type:",
                error
            );

            return;

        }


        await loadWishlist();

    });


    menu.appendChild(deleteButton);

    menu.appendChild(favouriteButton);

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

    card.appendChild(menu);

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

document.addEventListener("click", (event) => {

    if (
        !event.target.closest(".item-menu") &&
        !event.target.closest(".menu-button")
    ) {

        document
            .querySelectorAll(".item-menu.visible")
            .forEach((menu) => {

                menu.classList.remove("visible");

            });

    }

});

const itemLabel =
    document.querySelector("#item-label");

const linkLabel =
    document.querySelector("#link-label");

const favouriteLabel =
    document.querySelector("#favourite-label");

const confirmAdd =
    document.querySelector("#confirm-add");

confirmAdd.addEventListener("click", async () => {

    if (itemInput.value.trim() === "") {

        return;

    }


    const description =
        itemInput.value.trim();

    const link =
        linkInput.value.trim();

    const type =
        favouriteInput.checked
            ? "favourite"
            : "default";


    const { data, error } =
        await supabaseClient
            .from("wishlist")
            .insert([
                {
                    description: description,
                    link: link,
                    type: type
                }
            ])
            .select()
            .single();


    if (error) {

        console.error(
            "Error adding wishlist item:",
            error
        );

        return;

    }


    const newItem =
        new WishlistItem(
            data.id,
            data.description,
            data.link,
            data.type
        );


    wishlist.push(newItem);

    displayWishlist();


    itemInput.value = "";

    linkInput.value = "";

    favouriteInput.checked = false;

});

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

loadWishlist();