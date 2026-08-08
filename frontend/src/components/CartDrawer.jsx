import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  QrCode, 
  Sparkles, 
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useIntent } from '../context/IntentContext';

export default function CartDrawer() {
  const { cart, removeFromCart, addToCart, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { activeIntent } = useIntent();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Address form fields
  const [fullName, setFullName] = useState(user?.full_name || 'Venkat R.');
  const [address, setAddress] = useState('123 Innovation Way, Tech Park, Block B');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [pincode, setPincode] = useState('560100');

  if (!isCartOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset steps after slide-out transition
    setTimeout(() => {
      if (checkoutStep === 'success') {
        setCheckoutStep('cart');
      }
    }, 300);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderDetails({
        orderId: generatedOrderId,
        items: [...cart],
        total: cartTotal,
        address: `${address}, ${pincode}`,
        paymentMethod: paymentMethod === 'upi' ? 'UPI Instant Pay' : paymentMethod === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery'
      });
      setIsProcessing(false);
      clearCart();
      setCheckoutStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Overlay */}
      <div 
        onClick={handleClose} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl">
          
          {/* STEP 1: CART VIEW */}
          {checkoutStep === 'cart' && (
            <>
              {/* Cart Header */}
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-white font-heading">Your Shopping Cart</h2>
                    <p className="text-xs text-slate-400">{cart.length} unique items selected</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                      <ShoppingBag className="w-10 h-10 stroke-1" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-200">Your cart is empty</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">Explore catalog products or try our AI intent recommendations to add items.</p>
                    </div>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div 
                      key={product.id} 
                      className="glass-card p-4 rounded-2xl flex items-center gap-4 border border-slate-800 hover:border-indigo-500/30 transition-all"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl bg-slate-900 border border-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                        <div className="text-xs text-indigo-400 font-extrabold mt-0.5">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.express_delivery && (
                          <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
                            <Zap className="w-3 h-3 text-emerald-400" /> Express 24h
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs">
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-extrabold text-white px-1">{quantity}</span>
                          <button 
                            onClick={() => addToCart(product, 1)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-800 bg-slate-950/80 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-200">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-400" /> AI Priority Shipping
                      </span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800/80">
                      <span>Total Amount</span>
                      <span className="text-indigo-300 font-heading text-base">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full gradient-button py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30"
                  >
                    <span>Proceed to Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {checkoutStep === 'checkout' && (
            <>
              {/* Header with Back Button */}
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Cart
                </button>
                <h3 className="text-sm font-extrabold text-white font-heading">Instant AI Checkout</h3>
                <button onClick={handleClose} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* AI Intent Perk Banner */}
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 animate-pulse" />
                  <div className="text-xs">
                    <span className="font-bold text-indigo-300 block">Active Intent: {activeIntent}</span>
                    <span className="text-slate-300">Free 24h priority express delivery unlocked for your order.</span>
                  </div>
                </div>

                {/* Section 1: Shipping Address */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-400" /> Delivery Address
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Street Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Pincode</label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Payment Options */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-400" /> Select Payment Method
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'upi'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-indigo-400" />
                      <span className="text-[11px]">UPI Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-purple-400" />
                      <span className="text-[11px]">Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'cod'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Truck className="w-5 h-5 text-emerald-400" />
                      <span className="text-[11px]">Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                {/* Section 3: Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Order Items ({cart.length})</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Express Priority Delivery</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total Payable</span>
                    <span className="text-indigo-300 font-heading text-base">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full gradient-button py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment & Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Complete Payment (₹{cartTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {checkoutStep === 'success' && orderDetails && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              
              {/* Glowing Success Badge */}
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                  Order Confirmed
                </span>
                <h2 className="text-2xl font-black text-white font-heading">Thank You For Your Order!</h2>
                <p className="text-xs text-slate-400">Your order has been logged and dispatched via AI Express Logistics.</p>
              </div>

              {/* Order Info Card */}
              <div className="w-full glass-card p-5 rounded-2xl border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400 font-medium">Order Reference</span>
                  <span className="font-extrabold text-indigo-400">{orderDetails.orderId}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400 font-medium">Estimated Delivery</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Tomorrow by 5:00 PM
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400 font-medium">Payment Status</span>
                  <span className="font-semibold text-white">{orderDetails.paymentMethod} (Verified)</span>
                </div>

                <div className="flex justify-between pt-1">
                  <span className="text-slate-400 font-medium">Amount Paid</span>
                  <span className="font-extrabold text-white text-sm">₹{orderDetails.total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full gradient-button py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
