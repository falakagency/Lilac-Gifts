import { Switch, Route, Router as WouterRouter } from "wouter";
import { CartProvider } from "./cart";
import { ThemeProvider } from "./theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Track from "./pages/Track";
import NotFound from "./pages/NotFound";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:id" component={Category} />
      <Route path="/product/:id" component={Product} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirmation" component={Confirmation} />
      <Route path="/track" component={Track} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Routes />
          </Layout>
        </WouterRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
