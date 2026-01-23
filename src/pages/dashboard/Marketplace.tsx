import { useState } from 'react';
import { ShoppingBag, Package, ShoppingCart, Minus, Plus, X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Premium Dog Food', price: 49.99, category: 'Food', inStock: true },
  { id: 2, name: 'Cat Scratching Post', price: 29.99, category: 'Toys', inStock: true },
  { id: 3, name: 'Pet Vitamin Supplements', price: 24.99, category: 'Health', inStock: true },
  { id: 4, name: 'Comfortable Pet Bed', price: 59.99, category: 'Accessories', inStock: false },
  { id: 5, name: 'Interactive Dog Toy', price: 19.99, category: 'Toys', inStock: true },
  { id: 6, name: 'Cat Food - Salmon', price: 39.99, category: 'Food', inStock: true },
];

const Marketplace = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout',
        variant: 'destructive',
      });
      return;
    }

    initiatePayment({
      amount: cartTotal,
      name: 'PetCare Marketplace',
      description: `${cartItemCount} item(s) - Pet supplies`,
      notes: {
        items: cart.map((item) => `${item.name} x${item.quantity}`).join(', '),
      },
      onSuccess: () => {
        setCart([]);
        setIsCartOpen(false);
        toast({
          title: 'Order Placed!',
          description: 'Your pet supplies will be delivered soon',
        });
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground">Shop pet supplies and essentials</p>
        </div>
        <Button
          variant="outline"
          className="relative"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-card w-full max-w-md h-full overflow-y-auto shadow-xl animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="bg-muted rounded-lg p-2">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{item.name}</h3>
                          <p className="text-sm text-primary font-semibold">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isPaymentLoading}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      {isPaymentLoading ? 'Processing...' : 'Checkout with Razorpay'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-shadow">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
              <Package className="h-16 w-16 text-muted-foreground/50" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                {product.category}
              </span>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-2xl font-bold text-primary">₹{product.price}</p>
              
              <Button 
                variant={product.inStock ? "default" : "outline"} 
                className="w-full mt-2"
                disabled={!product.inStock}
                onClick={() => product.inStock && addToCart(product)}
              >
                {product.inStock ? (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
