class ProductManager {
    constructor() {
        this.title = document.getElementById("title");
        this.price = document.getElementById("price");
        this.taxes = document.getElementById("taxes");
        this.ads = document.getElementById("ads");
        this.discount = document.getElementById("discount");
        this.total = document.getElementById("total");
        this.countInput = document.getElementById("count");
        this.category = document.getElementById("category");
        this.submit = document.getElementById("submit");
        this.mood = 'create';
        this.datapro = [];

        // Retrieve saved product data from localStorage
        const savedProduct = localStorage.getItem('product');
        if (savedProduct && savedProduct !== "undefined") {
            try {
                this.datapro = JSON.parse(savedProduct);
            } catch (error) {
                console.error('Error parsing product from localStorage:', error);
                this.datapro = [];
            }
        }

        this.bindTotalCalculation(); // Bind total calculation to input fields
    }

    getTotal() {
        if (this.price.value !== "") {
            let result = (+this.price.value + +this.taxes.value + +this.ads.value) - +this.discount.value;
            this.total.innerHTML = result.toString();
            this.total.style.backgroundColor = "green";  // Convert result to string
        } else {
            this.total.innerHTML = "";  // Clear the total
            this.total.style.backgroundColor = " rgb(213, 6, 6);"; 

        }
    }

    bindTotalCalculation() {
        this.price.addEventListener('keyup', this.getTotal.bind(this));
        this.taxes.addEventListener('keyup', this.getTotal.bind(this));
        this.ads.addEventListener('keyup', this.getTotal.bind(this));
        this.discount.addEventListener('keyup', this.getTotal.bind(this));
    }

    handleFormSubmit() {
        this.submit.onclick = () => {
            let count = parseInt(this.countInput.value, 10) || 1;
            let newpro = {
                title: this.title.value.toLowerCase(),
                price: this.price.value,
                taxes: this.taxes.value,
                ads: this.ads.value,
                discount: this.discount.value,
                total: this.total.innerHTML,
                category: this.category.value.toLowerCase(),
            };

            if (this.mood === 'create') {
                if (count > 1) {
                    for (let i = 0; i < count; i++) {
                        this.datapro.push(newpro);
                    }
                } else {
                    this.datapro.push(newpro);
                }
            } else {
                this.datapro[this.tmp] = newpro;
                this.mood = 'create';
                this.submit.innerHTML = 'Create';
                this.countInput.style.display = 'block';
            }

            this.saveData();
            this.clearData();
            this.getTotal();
            this.showProducts();
        };
    }

    clearData() {
        this.title.value = '';
        this.price.value = '';
        this.taxes.value = '';
        this.ads.value = '';
        this.discount.value = '';
        this.total.innerHTML = '';
        this.countInput.value = '';
        this.category.value = '';
    }

    showProducts() {
        let table = '';

        for (let i = 0; i < this.datapro.length; i++) {
            if (this.datapro[i] !== null) {
                table += `
                    <tr>
                        <td>${i}</td>
                        <td>${this.datapro[i].title}</td>
                        <td>${this.datapro[i].price}</td>
                        <td>${this.datapro[i].taxes}</td>
                        <td>${this.datapro[i].ads}</td>
                        <td>${this.datapro[i].discount}</td>
                        <td>${this.datapro[i].total}</td>
                        <td>${this.datapro[i].category}</td>
                        <td><button onclick="productManager.updateProduct(${i})" id="update">Update</button></td>
                        <td><button onclick="productManager.deleteData(${i})" id="delete">Delete</button></td>
                    </tr>`;
            }
        }

        document.getElementById('tbody').innerHTML = table;

        let btnDelete = document.getElementById('deleteall');
        if (this.datapro.length > 0) {
            btnDelete.innerHTML = `<button onclick="productManager.deleteAll()">Delete All (${this.datapro.length})</button>`;
        } else {
            btnDelete.innerHTML = '';
        }
    }

    saveData() {
        localStorage.setItem('product', JSON.stringify(this.datapro));
    }

    deleteData(i) {
        this.datapro.splice(i, 1);
        this.saveData();
        this.showProducts();
    }

    deleteAll() {
        localStorage.clear();
        this.datapro.splice(0);
        this.showProducts();
    }

    updateProduct(i) {
        this.title.value = this.datapro[i].title;
        this.price.value = this.datapro[i].price;
        this.taxes.value = this.datapro[i].taxes;
        this.ads.value = this.datapro[i].ads;
        this.discount.value = this.datapro[i].discount;
        this.getTotal();
        this.countInput.style.display = 'none';
        this.category.value = this.datapro[i].category;
        this.submit.innerHTML = 'Update';
        this.mood = 'update';
        this.tmp = i;
    }

    searchByTitle(value) {
        let filteredData = this.datapro.filter(product => product.title.toLowerCase().includes(value.toLowerCase()));
        this.displaySearchResults(filteredData);
    }

    searchByCategory(value) {
        let filteredData = this.datapro.filter(product => product.category.toLowerCase().includes(value.toLowerCase()));
        this.displaySearchResults(filteredData);
    }

    displaySearchResults(filteredData) {
        let table = '';

        for (let i = 0; i < filteredData.length; i++) {
            table += `
                <tr>
                    <td>${i}</td>
                    <td>${filteredData[i].title}</td>
                    <td>${filteredData[i].price}</td>
                    <td>${filteredData[i].taxes}</td>
                    <td>${filteredData[i].ads}</td>
                    <td>${filteredData[i].discount}</td>
                    <td>${filteredData[i].total}</td>
                    <td>${filteredData[i].category}</td>
                    <td><button onclick="productManager.updateProduct(${i})" id="update">Update</button></td>
                    <td><button onclick="productManager.deleteData(${i})" id="delete">Delete</button></td>
                </tr>`;
        }

        document.getElementById('tbody').innerHTML = table;
    }

    handleSearchEvents() {
        this.searchByTitleBtn.onclick = () => {
            let searchTerm = this.searchInput.value;
            this.searchByTitle(searchTerm);
        };

        this.searchByCategoryBtn.onclick = () => {
            let searchTerm = this.searchInput.value;
            this.searchByCategory(searchTerm);
        };
    }
}

const productManager = new ProductManager();
productManager.handleFormSubmit();
productManager.bindTotalCalculation(); // Add this line to bind total calculation
productManager.handleSearchEvents();
