import { ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const products = [
  { id: 1, name: 'Premium Dog Food', price: 49.99, category: 'Food', inStock: true },
  { id: 2, name: 'Cat Scratching Post', price: 29.99, category: 'Toys', inStock: true },
  { id: 3, name: 'Pet Vitamin Supplements', price: 24.99, category: 'Health', inStock: true },
  { id: 4, name: 'Comfortable Pet Bed', price: 59.99, category: 'Accessories', inStock: false },
  { id: 5, name: 'Interactive Dog Toy', price: 19.99, category: 'Toys', inStock: true },
  { id: 6, name: 'Cat Food - Salmon', price: 39.99, category: 'Food', inStock: true },
];

const Marketplace = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">Shop pet supplies and essentials</p>
      </div>

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
              <p className="text-2xl font-bold text-primary">${product.price}</p>
              
              <Button 
                variant={product.inStock ? "default" : "outline"} 
                className="w-full mt-2"
                disabled={!product.inStock}
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
