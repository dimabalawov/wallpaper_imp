"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArrowIcon from "@/components/Media/ArrowIcon";
import TruckIcon from "@/components/Media/TruckIcon";

type DeliveryMethod = "nova-poshta" | "ukrposhta" | "self-pickup";
type DeliveryType = "branch" | "locker" | "courier";
type PaymentMethod = "card" | "cash-on-delivery";

export default function CheckoutPage() {
  const { cartItems, totalPrice, itemCount } = useCart();
  const router = useRouter();

  // Form state
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("nova-poshta");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("branch");
  const [city, setCity] = useState("");

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Delivery cost
  const deliveryCost = deliveryMethod === "self-pickup" ? 0 : 60;

  // Redirect if cart is empty
  if (itemCount === 0) {
    return (
      <div className="h-max text-center py-20 px-4">
        <h1 className="text-3xl font-semibold text-navy mb-4">
          Ваш кошик порожній
        </h1>
        <p className="text-gray-600 mb-8">
          Додайте товари до кошика, щоб оформити замовлення
        </p>
        <Link
          href="/wallpapers"
          className="bg-teal text-white font-bold rounded-lg px-8 py-3 text-lg hover:bg-transparent hover:text-teal border-2 border-teal transition-colors inline-block"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (cartItems.some((item) => !item.productDatabaseId)) {
      setSubmitError("Деякі товари без ID. Додайте їх до кошика ще раз.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: name,
            lastName: surname,
            phone,
            email,
          },
          comment,
          delivery: {
            method: deliveryMethod,
            type: deliveryType,
            city,
            cost: deliveryCost,
          },
          paymentMethod,
          items: cartItems,
          totals: {
            itemsTotal: totalPrice,
            orderTotal: totalPrice + deliveryCost,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Не вдалося створити замовлення");
      }

      router.push("/order-success");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Сталася помилка оформлення"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-[clamp(2rem,6vw,8rem)] lg:px-[clamp(3rem,10vw,16rem)] py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-navy mb-8">
        Оформлення замовлення
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Form */}
        <div className="flex-1 space-y-8">
          {/* Contact Details */}
          <div className="border-2 border-teal rounded-lg p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">
              Контактні дані
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Прізвище"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 text-navy outline-none focus:border-teal transition-colors"
              />
              <input
                type="text"
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 text-navy outline-none focus:border-teal transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="tel"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 text-navy outline-none focus:border-teal transition-colors"
              />
              <input
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 text-navy outline-none focus:border-teal transition-colors"
              />
            </div>
            <textarea
              placeholder="Коментар до замовлення"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-navy outline-none focus:border-teal transition-colors resize-none"
            />
          </div>

          {/* Delivery */}
          <div className="border-2 border-teal rounded-lg p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">Доставка</h2>

            {/* Delivery method buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setDeliveryMethod("nova-poshta")}
                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-lg border-2 transition-colors ${
                  deliveryMethod === "nova-poshta"
                    ? "border-teal bg-teal/5"
                    : "border-gray-300 hover:border-teal"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/nova-poshta-icon.png"
                    alt="Nova Poshta"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-navy">Нова Пошта</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("ukrposhta")}
                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-lg border-2 transition-colors ${
                  deliveryMethod === "ukrposhta"
                    ? "border-teal bg-teal/5"
                    : "border-gray-300 hover:border-teal"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/ukrposhta-icon.png"
                    alt="Ukrposhta"
                    width={28}
                    height={34}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-navy">Укрпошта</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("self-pickup")}
                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-lg border-2 transition-colors ${
                  deliveryMethod === "self-pickup"
                    ? "border-teal bg-teal/5"
                    : "border-gray-300 hover:border-teal"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <TruckIcon width={48} height={28} fill="#2F4157" />
                </div>
                <span className="font-medium text-navy">Самовивіз</span>
              </button>
            </div>

            {deliveryMethod !== "self-pickup" && (
              <div className="space-y-4">
                {/* Branch */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="branch"
                    checked={deliveryType === "branch"}
                    onChange={() => setDeliveryType("branch")}
                    className="mt-1 w-5 h-5 text-teal accent-teal"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy mb-1">
                      {deliveryMethod === "nova-poshta"
                        ? "Відділення Нової Пошти"
                        : "Відділення Укрпошти"}
                    </div>
                    {deliveryType === "branch" && (
                      <>
                        <div className="text-sm text-gray-600 mb-2">
                          Виберіть місто та відділення
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          Термін відправки складає 1-3 робочі дні.
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Місто"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-navy outline-none focus:border-teal transition-colors"
                          />
                          <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </label>

                {/* Locker */}
                {deliveryMethod === "nova-poshta" && (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="locker"
                      checked={deliveryType === "locker"}
                      onChange={() => setDeliveryType("locker")}
                      className="mt-1 w-5 h-5 text-teal accent-teal"
                    />
                    <div className="font-semibold text-navy">
                      Поштомат Нової Пошти
                    </div>
                  </label>
                )}

                {/* Courier */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="courier"
                    checked={deliveryType === "courier"}
                    onChange={() => setDeliveryType("courier")}
                    className="mt-1 w-5 h-5 text-teal accent-teal"
                  />
                  <div className="font-semibold text-navy">
                    Кур'єр на вашу адресу
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="border-2 border-teal rounded-lg p-6">
            <h2 className="text-xl font-semibold text-navy mb-6">Оплата</h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mt-1 w-5 h-5 text-teal accent-teal"
                />
                <div>
                  <div className="font-semibold text-navy mb-1">
                    Карткою Visa / MasterCard
                  </div>
                  <div className="text-sm text-gray-600">
                    Оплата через LiqPay, ApplePay, GooglePay
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cash-on-delivery"
                  checked={paymentMethod === "cash-on-delivery"}
                  onChange={() => setPaymentMethod("cash-on-delivery")}
                  className="mt-1 w-5 h-5 text-teal accent-teal"
                />
                <div>
                  <div className="font-semibold text-navy mb-1">
                    Післяплата
                  </div>
                  <div className="text-sm text-gray-600">
                    Оплата на пошті (комісія НП 2% + 20 грн)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Back to cart link */}
          <Link
            href="/cart"
            className="text-teal flex items-center gap-2 text-lg font-medium hover:underline"
          >
            <ArrowIcon />
            Повернутися до кошика
          </Link>
        </div>

        {/* Right column - Order summary */}
        <div className="lg:w-96">
          <div className="border-2 border-teal rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-navy mb-6">
              Ваше замовлення
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.imageUrl || "/placeholder.jpg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-navy text-sm mb-1">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      Розмір: {item.width}см x {item.height}см
                    </div>
                    <div className="font-bold text-navy">
                      {item.price.toFixed(2)} грн
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-teal pt-4 space-y-3">
              <div className="flex justify-between text-navy">
                <span>Доставка:</span>
                <span className="font-medium">{deliveryCost} грн</span>
              </div>
              <div className="flex justify-between text-navy text-xl font-bold">
                <span>Разом до сплати:</span>
                <span>{(totalPrice + deliveryCost).toFixed(2)} грн</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-teal text-white font-bold uppercase rounded-lg px-8 py-4 text-lg hover:bg-transparent hover:text-teal border-2 border-teal transition-colors"
            >
              {isSubmitting ? "Оформлення..." : "Перейти до оплати"}
            </button>
            {submitError && (
              <div className="mt-4 text-sm text-red-600">{submitError}</div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
