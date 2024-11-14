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

function App() {
  const name = "Dinithi";
  const cartCount = 2;



  return (
    <div>
      <Navbar/>
      {/*<Navigation name={name} cartCount={cartCount}/>*/}
      {/*<Hero/>
      <div className="p-4">
        <Button>Buy Now</Button>
      </div>
      <div className="p-4">
      <Card className=" p-4 w-96 border-spacing-1">
         <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
      <Input/>
      </Card>
      <Progress value={20} />
      </div>*/}
    </div>
  );
}

export default App;
