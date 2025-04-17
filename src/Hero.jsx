function Hero() {
  return (
    <section className="p-8 py-8">
      <div className="grid grid-cols-2 rounded-md min-h-full bg-card">
        <div className="flex flex-col justify-center p-16 gap-4">
          <span className="inline-block rounded-full px-2 text-sm w-fit bg-accent text-accent-foreground">
            WEEKLY DISCOUNT
          </span>
          <h1 className="text-6xl font-semibold text-foreground">
            Premium Product Online Shop
          </h1>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius quos
            suscipit est autem quia? Voluptatem?
          </p>
          <a
            to="/shop"
            className="text-primary-foreground bg-primary rounded-md w-fit block font-medium py-2 px-4"
          >
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