import { 
  asClass,
  asValue,
  createContainer,
  Lifetime
} from "awilix"
import VendorService from "../services/vendor"

export default ({ container }) => {
  container.register({
    vendorService: asClass(VendorService, {
      lifetime: Lifetime.SCOPED,
    }),
  })
}
