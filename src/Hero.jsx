
function Hero() {
  return (
    <section className="p-8 mx-16">
      <div className="grid grid-cols-2 rounded-md min-h-full bg-blue-50">
        <div className="flex flex-col justify-center p-16 gap-4">
          <span className="inline-block rounded-full px-2 text-sm w-fit bg-yellow-500">WEEKLY DISCOUNT</span>
          <h1 className="text-6xl font-semibold">Premium Product Online Shop</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quos
            suscipit est autem quia? Voluptatem?
          </p>
          <a to="/shop" className="text-white bg-black rounded-md w-fit block font-medium py-2 px-4">
            Shop Now
          </a>
        </div>
        <div className="relative">
          <img
            src="https://fee-storefront.vercel.app/assets/hero/hero.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;