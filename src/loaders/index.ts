import { 
  asClass,
  asValue,
  createContainer,
  Lifetime
} from "awilix"
import VendorService from "../services/vendor"
import ProductService from "../services/product"
import ImageUploadService from "../services/image-upload"

export default ({ container }) => {
  container.register({
    vendorService: asClass(VendorService, {
      lifetime: Lifetime.SCOPED,
    }),
    productService: asClass(ProductService, {
      lifetime: Lifetime.SCOPED,
    }),
    imageUploadService: asClass(ImageUploadService, {
      lifetime: Lifetime.SCOPED,
    }),
  })
  
  // Load static file serving
  try {
    require('./static-files')(container)
  } catch (error) {
    console.error('Error loading static files:', error)
  }
}
