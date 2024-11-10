document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Cabe Merah", img: "1.jpg", price: 25000, description: "Cabe merah segar." },
      { id: 2, name: "Tomat", img: "2.jpg", price: 15000, description: "Tomat yang matang." },
      { id: 3, name: "Kentang", img: "3.jpg", price: 20000, description: "Kentang berkualitas." },
      { id: 4, name: "Bunga Kol", img: "4.jpg", price: 26000, description: "Bunga kol segar." },
      { id: 5, name: "Bawang Merah", img: "5.jpg", price: 15000, description: "Bawang merah berkualitas." },
      { id: 6, name: "Bawang Bombai", img: "6.jpg", price: 40000, description: "Bawang bombai berkualitas." },
      { id: 7, name: "Beras", img: "7.jpg", price: 16000, description: "Beras lokal." },
      { id: 8, name: "Buncis", img: "8.jpg", price: 8000, description: "Buncis segar." },
    ],
    
    openModal(product) {
      this.$dispatch('open-modal', product);
    },
    searchTerm: "", // Tambahkan properti searchTerm
    searchProduct() {
      const foundItem = this.items.find(
        (item) => item.name.toLowerCase() === this.searchTerm.toLowerCase()
      );
      if (foundItem) {
        const productElement = document.getElementById(
          "product-" + foundItem.id
        );
        if (productElement) {
          productElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        alert("Produk tidak ditemukan");
      }
    },

  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barag sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      }
      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6285726095636?text=" + encodeURIComponent(message));

  // minta transaction token menggunakan ajax / fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// Format pesan Whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
  )}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
