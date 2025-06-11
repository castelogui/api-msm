import { Router } from "express";

/* Controllers */
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { EditCategoryController } from "./controllers/category/EditCategoryController";
import { ListCategoriesController } from "./controllers/category/ListCategoriesController";
import { DeleteCategoryController } from "./controllers/category/DeleteCategoryController";
import { EditProductController } from "./controllers/product/EditProductController";
import { ListProductsController } from "./controllers/product/ListProductsController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { SaleProductController } from "./controllers/product/SaleProductController";
import { EditUserController } from "./controllers/user/EditUserController";
import { ListUserController } from "./controllers/user/ListUserController";
import { DeleteUserController } from "./controllers/user/DeleteUserController";
import { CreatePermissionController } from "./controllers/permission/CreatePermissionController";
import { EditPermissionController } from "./controllers/permission/EditPermissionController";

const router = Router();

/* AUTH */
router.post("/auth", new AuthUserController().handle);

/* USER */
router.post("/user", isAuthenticated, new CreateUserController().handle);
router.get("/user", isAuthenticated, new ListUserController().handle);
router.put("/user/:id", isAuthenticated, new EditUserController().handle);
router.delete("/user/:id", isAuthenticated, new DeleteUserController().handle);
/* PERMISSION */
router.post("/permission", isAuthenticated, new CreatePermissionController().handle)
router.put("/permission/:id", isAuthenticated, new EditPermissionController().handle)
/* CATEGORY */
router.post(
  "/category",
  isAuthenticated,
  new CreateCategoryController().handle
);
router.put(
  "/category/edit",
  isAuthenticated,
  new EditCategoryController().handle
);
router.get(
  "/categories",
  isAuthenticated,
  new ListCategoriesController().handle
);
router.delete(
  "/category/delete",
  isAuthenticated,
  new DeleteCategoryController().handle
);

/* PRODUCT */
router.post("/product", isAuthenticated, new CreateProductController().handle);
router.put(
  "/product/edit",
  isAuthenticated,
  new EditProductController().handle
);
router.get("/products", isAuthenticated, new ListProductsController().handle);
router.delete(
  "/product/delete",
  isAuthenticated,
  new DeleteProductController().handle
);
router.put(
  "/product/sale",
  isAuthenticated,
  new SaleProductController().handle
);

export { router };
