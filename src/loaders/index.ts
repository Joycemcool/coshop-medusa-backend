import { 
  asClass,
  asValue,
  createContainer,
  Lifetime
} from "awilix"
import VendorService from "../services/vendor"
import ProductService from "../services/product"

export default ({ container }) => {
  container.register({
    vendorService: asClass(VendorService, {
      lifetime: Lifetime.SCOPED,
    }),
    productService: asClass(ProductService, {
      lifetime: Lifetime.SCOPED,
    }),
  })
}
