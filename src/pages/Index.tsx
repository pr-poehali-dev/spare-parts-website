import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Part {
  id: number;
  name: string;
  article: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  inStock: boolean;
}

interface CartItem extends Part {
  quantity: number;
}

const mockParts: Part[] = [
  { id: 1, name: 'Масляный фильтр', article: 'OF-2845', price: 450, brand: 'Bosch', category: 'Фильтры', image: 'https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg', inStock: true },
  { id: 2, name: 'Тормозные колодки', article: 'BP-9412', price: 2800, brand: 'Brembo', category: 'Тормоза', image: 'https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg', inStock: true },
  { id: 3, name: 'Свечи зажигания', article: 'SP-6721', price: 680, brand: 'NGK', category: 'Двигатель', image: 'https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg', inStock: true },
  { id: 4, name: 'Амортизатор передний', article: 'SH-3398', price: 4200, brand: 'Sachs', category: 'Подвеска', image: 'https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg', inStock: false },
  { id: 5, name: 'Воздушный фильтр', article: 'AF-1156', price: 520, brand: 'Mann', category: 'Фильтры', image: 'https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg', inStock: true },
  { id: 6, name: 'Стартер', article: 'ST-8843', price: 8900, brand: 'Valeo', category: 'Электрика', image: 'https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg', inStock: true },
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('catalog');

  const brands = ['Все', ...Array.from(new Set(mockParts.map(p => p.brand)))];
  const categories = ['Все', ...Array.from(new Set(mockParts.map(p => p.category)))];

  const filteredParts = mockParts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         part.article.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || part.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const addToCart = (part: Part) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === part.id);
      if (existing) {
        return prev.map(item => 
          item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...part, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Icon name="Wrench" size={28} className="text-accent" />
            <h1 className="text-2xl font-bold">АвтоЗапчасти</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('catalog')} className="text-sm font-medium hover:text-accent transition-colors">
              Каталог
            </button>
            <button onClick={() => setActiveTab('about')} className="text-sm font-medium hover:text-accent transition-colors">
              О компании
            </button>
            <button onClick={() => setActiveTab('delivery')} className="text-sm font-medium hover:text-accent transition-colors">
              Доставка
            </button>
            <button onClick={() => setActiveTab('warranty')} className="text-sm font-medium hover:text-accent transition-colors">
              Гарантии
            </button>
            <button onClick={() => setActiveTab('contacts')} className="text-sm font-medium hover:text-accent transition-colors">
              Контакты
            </button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
                <SheetDescription>
                  {cartCount > 0 ? `Товаров: ${cartCount}` : 'Корзина пуста'}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Добавьте товары в корзину</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Артикул: {item.article}</p>
                          <p className="text-sm font-bold mt-1">{item.price} ₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="ml-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center py-4">
                      <span className="text-lg font-bold">Итого:</span>
                      <span className="text-2xl font-bold text-accent">{totalPrice.toLocaleString()} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">
                      <Icon name="CreditCard" size={18} className="mr-2" />
                      Оформить заказ
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="catalog" className="space-y-6">
            <div 
              className="relative h-[300px] rounded-lg overflow-hidden bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://cdn.poehali.dev/projects/31dfca86-2a71-4456-928e-51a63be8df08/files/707d02bf-8e23-4985-a45e-1f5be17ce930.jpg)` }}
            >
              <div className="text-center text-white z-10">
                <h2 className="text-5xl font-bold mb-4">Оригинальные запчасти</h2>
                <p className="text-xl mb-6">Широкий ассортимент для всех марок авто</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[280px_1fr]">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Марка</label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите марку" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все марки</SelectItem>
                        {brands.slice(1).map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Категория</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все категории</SelectItem>
                        {categories.slice(1).map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedBrand('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input 
                    placeholder="Поиск по названию или артикулу..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredParts.map(part => (
                    <Card key={part.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={part.image} alt={part.name} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={part.inStock ? 'default' : 'secondary'}>
                            {part.inStock ? 'В наличии' : 'Под заказ'}
                          </Badge>
                          <Badge variant="outline">{part.brand}</Badge>
                        </div>
                        <CardTitle className="text-lg">{part.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Icon name="FileText" size={14} />
                          {part.article}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{part.category}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-accent">{part.price} ₽</span>
                        <Button 
                          onClick={() => addToCart(part)}
                          disabled={!part.inStock}
                        >
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {filteredParts.length === 0 && (
                  <Card className="p-12">
                    <p className="text-center text-muted-foreground">
                      Товары не найдены. Попробуйте изменить параметры поиска.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">О компании</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">Мы — надежный поставщик оригинальных автозапчастей с опытом работы более 15 лет.</p>
                <p>Наша компания специализируется на продаже качественных запчастей для всех марок автомобилей. Мы работаем напрямую с официальными производителями, что гарантирует подлинность и качество всей продукции.</p>
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-6 border rounded-lg">
                    <Icon name="Award" size={48} className="mx-auto mb-4 text-accent" />
                    <h3 className="font-bold mb-2">15+ лет</h3>
                    <p className="text-sm text-muted-foreground">на рынке</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Icon name="Users" size={48} className="mx-auto mb-4 text-accent" />
                    <h3 className="font-bold mb-2">50000+</h3>
                    <p className="text-sm text-muted-foreground">довольных клиентов</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Icon name="Package" size={48} className="mx-auto mb-4 text-accent" />
                    <h3 className="font-bold mb-2">100000+</h3>
                    <p className="text-sm text-muted-foreground">товаров в наличии</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Доставка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Icon name="Truck" size={32} className="text-accent flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Доставка по городу</h3>
                      <p className="text-muted-foreground">Бесплатная доставка при заказе от 5000 ₽. Срок доставки — 1-2 дня.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-4">
                    <Icon name="MapPin" size={32} className="text-accent flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Самовывоз</h3>
                      <p className="text-muted-foreground">Забрать заказ можно в наших магазинах. Товар резервируется на 3 дня.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-4">
                    <Icon name="Globe" size={32} className="text-accent flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg mb-2">Доставка по России</h3>
                      <p className="text-muted-foreground">Отправка транспортными компаниями. Срок доставки — 3-7 дней в зависимости от региона.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warranty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Гарантии</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Icon name="Shield" size={32} className="text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Гарантия качества</h3>
                    <p className="text-muted-foreground">Все запчасти оригинальные с гарантией от производителя от 6 до 24 месяцев.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <Icon name="RefreshCw" size={32} className="text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Возврат товара</h3>
                    <p className="text-muted-foreground">Возврат возможен в течение 14 дней при сохранении товарного вида и упаковки.</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <Icon name="CheckCircle" size={32} className="text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Проверка перед отправкой</h3>
                    <p className="text-muted-foreground">Каждый товар проверяется на соответствие артикулу и отсутствие брака.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Контакты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Icon name="Phone" size={24} className="text-accent" />
                      <div>
                        <p className="font-bold">Телефон</p>
                        <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Icon name="Mail" size={24} className="text-accent" />
                      <div>
                        <p className="font-bold">Email</p>
                        <p className="text-muted-foreground">info@avtozapchasti.ru</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Icon name="MapPin" size={24} className="text-accent" />
                      <div>
                        <p className="font-bold">Адрес</p>
                        <p className="text-muted-foreground">г. Москва, ул. Автомобильная, д. 15</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Icon name="Clock" size={24} className="text-accent" />
                      <div>
                        <p className="font-bold">Режим работы</p>
                        <p className="text-muted-foreground">Пн-Пт: 9:00 - 20:00</p>
                        <p className="text-muted-foreground">Сб-Вс: 10:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-6 bg-muted/50">
                    <h3 className="font-bold text-lg mb-4">Обратная связь</h3>
                    <form className="space-y-4">
                      <Input placeholder="Ваше имя" />
                      <Input placeholder="Телефон" type="tel" />
                      <Input placeholder="Email" type="email" />
                      <Button className="w-full">
                        <Icon name="Send" size={18} className="mr-2" />
                        Отправить
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Wrench" size={24} className="text-accent" />
                <span className="font-bold">АвтоЗапчасти</span>
              </div>
              <p className="text-sm text-muted-foreground">Надежный поставщик оригинальных автозапчастей</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setActiveTab('about')} className="text-muted-foreground hover:text-accent">О компании</button></li>
                <li><button onClick={() => setActiveTab('delivery')} className="text-muted-foreground hover:text-accent">Доставка</button></li>
                <li><button onClick={() => setActiveTab('warranty')} className="text-muted-foreground hover:text-accent">Гарантии</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Двигатель</li>
                <li className="text-muted-foreground">Тормоза</li>
                <li className="text-muted-foreground">Подвеска</li>
                <li className="text-muted-foreground">Электрика</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+7 (495) 123-45-67</li>
                <li>info@avtozapchasti.ru</li>
                <li>г. Москва, ул. Автомобильная, 15</li>
              </ul>
            </div>
          </div>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">© 2024 АвтоЗапчасти. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
