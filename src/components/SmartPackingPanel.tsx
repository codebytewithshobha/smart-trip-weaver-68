import { useState } from "react";
import { ShoppingCart, MapPin, ExternalLink, ChevronDown, ChevronUp, IndianRupee, Store, Globe, Check, X } from "lucide-react";

interface PackingItem {
  name: string;
  priceRange: { min: number; max: number };
  onlineStores: { name: string; url: string; price: number }[];
  availableLocally: boolean;
}

interface PackingCategory {
  category: string;
  icon: string;
  items: PackingItem[];
}

const packingData: PackingCategory[] = [
  {
    category: "Essentials",
    icon: "🎒",
    items: [
      { name: "Power Bank 20000mAh", priceRange: { min: 500, max: 2500 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=power+bank+20000mah", price: 799 },
        { name: "Flipkart", url: "https://www.flipkart.com/search?q=power+bank+20000mah", price: 749 },
        { name: "Croma", url: "https://www.croma.com/searchB?q=power+bank", price: 899 },
      ], availableLocally: true },
      { name: "Travel Wallet/Organizer", priceRange: { min: 200, max: 1500 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=travel+wallet+organizer", price: 349 },
        { name: "Myntra", url: "https://www.myntra.com/travel-accessories", price: 499 },
      ], availableLocally: true },
      { name: "Universal Travel Adapter", priceRange: { min: 250, max: 1200 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=universal+travel+adapter", price: 399 },
        { name: "Flipkart", url: "https://www.flipkart.com/search?q=travel+adapter", price: 349 },
      ], availableLocally: false },
      { name: "First Aid Kit", priceRange: { min: 150, max: 800 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=travel+first+aid+kit", price: 299 },
        { name: "PharmEasy", url: "https://pharmeasy.in/search/all?name=first+aid+kit", price: 249 },
      ], availableLocally: true },
    ],
  },
  {
    category: "Clothing",
    icon: "👕",
    items: [
      { name: "Comfortable Walking Shoes", priceRange: { min: 800, max: 4000 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=walking+shoes", price: 1299 },
        { name: "Myntra", url: "https://www.myntra.com/sports-shoes", price: 1499 },
        { name: "Decathlon", url: "https://www.decathlon.in/search?Ntt=walking+shoes", price: 999 },
      ], availableLocally: true },
      { name: "Light Rain Jacket", priceRange: { min: 500, max: 3000 }, onlineStores: [
        { name: "Decathlon", url: "https://www.decathlon.in/search?Ntt=rain+jacket", price: 799 },
        { name: "Amazon", url: "https://www.amazon.in/s?k=rain+jacket", price: 699 },
      ], availableLocally: false },
      { name: "Quick-Dry T-Shirts (Pack)", priceRange: { min: 400, max: 2000 }, onlineStores: [
        { name: "Myntra", url: "https://www.myntra.com/tshirts?f=Fabric%3ADry+Fit", price: 599 },
        { name: "Decathlon", url: "https://www.decathlon.in/search?Ntt=quick+dry+tshirt", price: 499 },
      ], availableLocally: true },
      { name: "Sunglasses UV Protection", priceRange: { min: 300, max: 2500 }, onlineStores: [
        { name: "Lenskart", url: "https://www.lenskart.com/sunglasses.html", price: 499 },
        { name: "Amazon", url: "https://www.amazon.in/s?k=uv+sunglasses", price: 399 },
      ], availableLocally: true },
    ],
  },
  {
    category: "Tech & Gadgets",
    icon: "📱",
    items: [
      { name: "Noise-Cancelling Earbuds", priceRange: { min: 1000, max: 5000 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=noise+cancelling+earbuds", price: 1499 },
        { name: "Flipkart", url: "https://www.flipkart.com/search?q=anc+earbuds", price: 1299 },
        { name: "Croma", url: "https://www.croma.com/searchB?q=anc+earbuds", price: 1599 },
      ], availableLocally: false },
      { name: "Action Camera / GoPro", priceRange: { min: 3000, max: 15000 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=action+camera", price: 4999 },
        { name: "Flipkart", url: "https://www.flipkart.com/search?q=action+camera", price: 4499 },
      ], availableLocally: false },
      { name: "Portable WiFi Hotspot", priceRange: { min: 1500, max: 4000 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=portable+wifi+hotspot", price: 2499 },
        { name: "Jio", url: "https://www.jio.com/en-in/jiofi", price: 1999 },
      ], availableLocally: true },
    ],
  },
  {
    category: "Toiletries & Health",
    icon: "🧴",
    items: [
      { name: "Sunscreen SPF 50+", priceRange: { min: 200, max: 1500 }, onlineStores: [
        { name: "Nykaa", url: "https://www.nykaa.com/search/result/?q=sunscreen+spf+50", price: 349 },
        { name: "Amazon", url: "https://www.amazon.in/s?k=sunscreen+spf+50", price: 299 },
        { name: "PharmEasy", url: "https://pharmeasy.in/search/all?name=sunscreen", price: 319 },
      ], availableLocally: true },
      { name: "Insect Repellent Spray", priceRange: { min: 100, max: 500 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=insect+repellent+spray", price: 149 },
        { name: "BigBasket", url: "https://www.bigbasket.com/ps/?q=mosquito+repellent", price: 129 },
      ], availableLocally: true },
      { name: "Travel Toiletry Kit", priceRange: { min: 300, max: 1500 }, onlineStores: [
        { name: "Amazon", url: "https://www.amazon.in/s?k=travel+toiletry+kit", price: 449 },
        { name: "Myntra", url: "https://www.myntra.com/travel-accessories?f=Categories%3ATravel+Kits", price: 599 },
      ], availableLocally: false },
    ],
  },
];

interface Props {
  destination: string;
}

export default function SmartPackingPanel({ destination }: Props) {
  const [selectedItem, setSelectedItem] = useState<PackingItem | null>(null);
  const [maxBudget, setMaxBudget] = useState<number>(5000);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (name: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const localMarkets: Record<string, { name: string; type: string; tip: string }[]> = {
    default: [
      { name: "Main Market / Bazaar", type: "General", tip: "Bargain for 20-30% off on marked prices" },
      { name: "Station Road Shops", type: "Essentials", tip: "Quick buys near railway/bus station" },
      { name: "Local Mall / Shopping Complex", type: "Branded", tip: "Fixed prices, AC comfort, all categories" },
    ],
  };

  const getMarkets = () => localMarkets.default.map(m => ({ ...m, name: `${destination} ${m.name}` }));

  const filteredStores = (item: PackingItem) =>
    item.onlineStores.filter(s => s.price <= maxBudget);

  return (
    <div className="space-y-4">
      {/* Budget Filter */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
        <IndianRupee className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">Max budget per item:</span>
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={maxBudget}
          onChange={e => setMaxBudget(+e.target.value)}
          className="flex-1 accent-primary h-1.5"
        />
        <span className="text-sm font-bold text-primary min-w-[60px] text-right">₹{maxBudget.toLocaleString()}</span>
      </div>

      {/* Packing Categories */}
      {packingData.map(cat => (
        <div key={cat.category}>
          <h4 className="font-semibold text-foreground text-sm mb-2">{cat.icon} {cat.category}</h4>
          <div className="flex flex-wrap gap-2">
            {cat.items.map(item => {
              const isSelected = selectedItem?.name === item.name;
              const isChecked = checkedItems.has(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedItem(isSelected ? null : item)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 hover:scale-105 ${
                    isChecked
                      ? "bg-primary/20 border-primary text-primary line-through opacity-70"
                      : isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-secondary border-border text-secondary-foreground hover:border-primary/50"
                  }`}
                >
                  <ShoppingCart className="w-3 h-3" />
                  {item.name}
                  <span className="text-[10px] opacity-70">₹{item.priceRange.min}+</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected Item Detail */}
      {selectedItem && (
        <div className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              {selectedItem.name}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                ₹{selectedItem.priceRange.min} – ₹{selectedItem.priceRange.max}
              </span>
              <button
                onClick={() => toggleCheck(selectedItem.name)}
                className={`text-xs px-2 py-1 rounded-md border transition ${
                  checkedItems.has(selectedItem.name)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                }`}
              >
                {checkedItems.has(selectedItem.name) ? (
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Packed</span>
                ) : (
                  <span className="flex items-center gap-1"><X className="w-3 h-3" /> Mark Packed</span>
                )}
              </button>
            </div>
          </div>

          {/* Online Stores */}
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Buy Online (within ₹{maxBudget.toLocaleString()})
            </h5>
            {filteredStores(selectedItem).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredStores(selectedItem).map(store => (
                  <a
                    key={store.name}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/80 border border-border hover:border-primary/50 hover:bg-secondary transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{store.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">₹{store.price}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No stores found within ₹{maxBudget.toLocaleString()}. Try increasing your budget.</p>
            )}
          </div>

          {/* Local Markets */}
          {selectedItem.availableLocally && (
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Buy at {destination} — Skip packing from home!
              </h5>
              <div className="space-y-2">
                {getMarkets().map(market => (
                  <a
                    key={market.name}
                    href={`https://www.google.com/maps/search/${encodeURIComponent(market.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-accent/30 border border-border hover:border-primary/50 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary" />
                        {market.name}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{market.type}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">💡 {market.tip}</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition" />
                  </a>
                ))}
              </div>
              <p className="text-[11px] text-primary/70 mt-2 italic">
                🎒 Available locally — no need to carry from home! Buy fresh at {destination}.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center">
        Click any item to see shopping options • Check off items you've packed
      </p>
    </div>
  );
}
