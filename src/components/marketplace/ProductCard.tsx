import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => Promise<boolean>;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    await onAddToCart(product.id);
    setAdding(false);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
          <Badge variant="secondary" className="shrink-0">{product.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{Number(product.price).toFixed(2)}</span>
          {product.stock_quantity > 0 ? (
            <span className="text-xs text-green-600 dark:text-green-400">In Stock</span>
          ) : (
            <span className="text-xs text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={adding || product.stock_quantity === 0}
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
