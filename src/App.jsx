import Greeting from './Greeting';
import Hero from './Hero';
import Navbar from './Navbar';
import Navigation from './Navigation';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Products from './Products';

function App() {
  const name = "Dinithi";
  const cartCount = 2;



  return (
    <div>
      {/*<Navbar/>*/}
      <Navigation name={name} cartCount={cartCount}/>
      <Hero/>
      <Products/>
    </div>
  );
}

export default App;
