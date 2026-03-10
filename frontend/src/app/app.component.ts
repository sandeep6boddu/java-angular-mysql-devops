import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/product.service';
import { OrderService, OrderResponse } from './services/order.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Millet Cookies', 'Millet Bars', 'Millet Crunchies', 'Millet Puffs'];
  activeCategory: string = 'All';
  isMenuOpen: boolean = false;
  isLoading: boolean = true;
  useFallback: boolean = false;

  // Cart
  cartItems: { product: Product; quantity: number }[] = [];
  isCartOpen: boolean = false;
  toastMessage: string = '';
  showToast: boolean = false;
  private toastTimeout: any;

  // Checkout
  isCheckout: boolean = false;
  checkoutForm = {
    name: '',
    email: '',
    address: ''
  };
  isSubmittingOrder: boolean = false;

  // Admin
  isAdminView: boolean = false;
  orders: OrderResponse[] = [];
  isLoadingAdmin: boolean = false;
  hasPlacedOrder: boolean = false;

  // Fallback product data when backend is not running
  fallbackProducts: Product[] = [
    { id: 1, name: 'Choco Chip Millet Cookies', description: 'Delicious millet cookies loaded with rich chocolate chips. A guilt-free treat packed with fiber and natural goodness.', price: 199, category: 'Millet Cookies', imageUrl: 'assets/products/cookies.png', isAvailable: true },
    { id: 2, name: 'Butter Nut Millet Cookies', description: 'Crunchy butter nut millet cookies made with wholesome millets and premium nuts. Perfect for tea-time snacking.', price: 219, category: 'Millet Cookies', imageUrl: 'assets/products/cookies.png', isAvailable: true },
    { id: 3, name: 'Cashew Nut Millet Cookies', description: 'Premium millet cookies enriched with roasted cashew nuts. A protein-rich snack for health-conscious foodies.', price: 249, category: 'Millet Cookies', imageUrl: 'assets/products/cookies.png', isAvailable: true },
    { id: 4, name: 'Dry Fruits Millet Bar', description: 'Energy-packed millet bar loaded with almonds, cashews, and raisins. The perfect on-the-go healthy snack.', price: 179, category: 'Millet Bars', imageUrl: 'assets/products/bars.png', isAvailable: true },
    { id: 5, name: 'Peanut Chikki Millet Bar', description: 'Traditional chikki reimagined with millets and crunchy peanuts. A high-protein energy booster.', price: 149, category: 'Millet Bars', imageUrl: 'assets/products/bars.png', isAvailable: true },
    { id: 6, name: 'Crunch Millet Energy Bar', description: 'Crispy millet energy bar with a satisfying crunch. Gluten-free and perfect for pre or post workout fuel.', price: 169, category: 'Millet Bars', imageUrl: 'assets/products/bars.png', isAvailable: true },
    { id: 7, name: 'Tomato Millet Crunchies', description: 'Baked millet crunchies with a tangy tomato twist. A healthier alternative to regular chips, with zero preservatives.', price: 129, category: 'Millet Crunchies', imageUrl: 'assets/products/crunchies.png', isAvailable: true },
    { id: 8, name: 'Cream & Onion Millet Crunchies', description: 'Irresistible cream and onion flavored baked millet chips. Light, crispy, and full of wholesome millet goodness.', price: 129, category: 'Millet Crunchies', imageUrl: 'assets/products/crunchies.png', isAvailable: true },
    { id: 9, name: 'Masala Millet Crunchies', description: 'Spicy masala millet crunchies with a bold Indian flavor. Baked, not fried — for a healthier snacking experience.', price: 129, category: 'Millet Crunchies', imageUrl: 'assets/products/crunchies.png', isAvailable: true },
    { id: 10, name: 'Chia Puffs', description: 'Crunchy millet puffs with organic chia seeds. A fiber-rich, high-protein snack that is baked and gluten-free.', price: 159, category: 'Millet Puffs', imageUrl: 'assets/products/chiapuffs.png', isAvailable: true }
  ];

  // Category image mapping
  categoryImages: { [key: string]: string } = {
    'Millet Cookies': 'assets/products/cookies.png',
    'Millet Bars': 'assets/products/bars.png',
    'Millet Crunchies': 'assets/products/crunchies.png',
    'Millet Puffs': 'assets/products/chiapuffs.png'
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => ({
          ...p,
          imageUrl: this.categoryImages[p.category] || 'assets/products/cookies.png'
        }));
        this.filteredProducts = this.products;
        this.isLoading = false;
      },
      error: () => {
        // Fallback to static data if backend is not available
        this.useFallback = true;
        this.products = this.fallbackProducts;
        this.filteredProducts = this.products;
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.activeCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(sectionId: string): void {
    this.isMenuOpen = false;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Cart methods
  addToCart(product: Product): void {
    const existing = this.cartItems.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.showToastMessage(`${product.name} added to cart!`);
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
  }

  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      }
    }
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  // Checkout methods
  proceedToCheckout(): void {
    this.isCheckout = true;
  }

  backToCart(): void {
    this.isCheckout = false;
  }

  submitOrder(): void {
    if (!this.checkoutForm.name || !this.checkoutForm.email || !this.checkoutForm.address) {
      this.showToastMessage('Please fill all checkout fields');
      return;
    }

    this.isSubmittingOrder = true;

    // Map cart items
    const orderItems = this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const request = {
      customerName: this.checkoutForm.name,
      customerEmail: this.checkoutForm.email,
      shippingAddress: this.checkoutForm.address,
      items: orderItems
    };

    this.orderService.createOrder(request).subscribe({
      next: (response) => {
        this.cartItems = [];
        this.isCheckout = false;
        this.isCartOpen = false;
        this.checkoutForm = { name: '', email: '', address: '' };
        this.isSubmittingOrder = false;
        this.hasPlacedOrder = true;
        this.showToastMessage('Order placed successfully! 🎉');
      },
      error: (err) => {
        this.isSubmittingOrder = false;
        this.showToastMessage('Failed to place order. Please try again.');
        console.error('Order checkout error:', err);
      }
    });
  }

  // Admin methods
  toggleAdminView(): void {
    this.isAdminView = !this.isAdminView;
    if (this.isAdminView) {
      this.isMenuOpen = false;
      this.isCartOpen = false;
      this.loadOrders();
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        this.scrollTo('hero');
      }, 0);
    }
  }

  loadOrders(): void {
    this.isLoadingAdmin = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoadingAdmin = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.isLoadingAdmin = false;
        this.showToastMessage('Failed to load orders from backend');
      }
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== id);
          this.showToastMessage(`Order #${id} deleted successfully.`);
        },
        error: (err) => {
          console.error('Failed to delete order', err);
          this.showToastMessage('Failed to delete order. Please try again.');
        }
      });
    }
  }
}
