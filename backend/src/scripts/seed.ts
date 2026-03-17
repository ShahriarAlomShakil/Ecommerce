import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  deleteCollectionsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
  deleteRegionsWorkflow,
  deleteShippingOptionsWorkflow,
  deleteTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const PRODUCT_IMAGE_PATH =
  "/home/shakil/Desktop/E-commerce/On-the-body-Rice-Therapy-Artemisia-pH-Balance-Cleanser-150-ml-3.jpg";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

async function clearPreviousSeedData(container: ExecArgs["container"], logger: any, query: any) {
  logger.info("Clearing previously seeded data...");

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
  });

  if (shippingOptions?.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: {
        ids: shippingOptions.map((item: { id: string }) => item.id),
      },
    });
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "parent_id"],
  });

  if (taxRegions?.length) {
    const sortedTaxRegionIds = [...taxRegions]
      .sort((a: { parent_id?: string | null }, b: { parent_id?: string | null }) => {
        if (!a.parent_id && b.parent_id) return -1;
        if (a.parent_id && !b.parent_id) return 1;
        return 0;
      })
      .map((item: { id: string }) => item.id);

    await deleteTaxRegionsWorkflow(container).run({
      input: {
        ids: sortedTaxRegionIds,
      },
    });
  }

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id"],
  });

  if (regions?.length) {
    await deleteRegionsWorkflow(container).run({
      input: {
        ids: regions.map((item: { id: string }) => item.id),
      },
    });
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id"],
  });

  if (products?.length) {
    await deleteProductsWorkflow(container).run({
      input: {
        ids: products.map((item: { id: string }) => item.id),
      },
    });
  }

  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id"],
  });

  if (collections?.length) {
    await deleteCollectionsWorkflow(container).run({
      input: {
        ids: collections.map((item: { id: string }) => item.id),
      },
    });
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
  });

  if (categories?.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: categories.map((item: { id: string }) => item.id),
    });
  }

  logger.info("Finished clearing previous seed data.");
}

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  await clearPreviousSeedData(container, logger, query);

  const countries = ["bd"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "bdt",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding Bangladesh region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Bangladesh",
          currency_code: "bdt",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding region data.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Dhaka Warehouse",
          address: {
            city: "Dhaka",
            country_code: "BD",
            address_1: "Uttara",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Dhaka Warehouse Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Bangladesh",
        geo_zones: [
          {
            country_code: "bd",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Inside Dhaka - Standard",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivery in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "bdt",
            amount: 60,
          },
          {
            currency_code: "usd",
            amount: 1,
          },
          {
            region_id: region.id,
            amount: 60,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Outside Dhaka - Express",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivery in 24-48 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "bdt",
            amount: 120,
          },
          {
            currency_code: "usd",
            amount: 2,
          },
          {
            region_id: region.id,
            amount: 120,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding Korean skincare categories and collections...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Cleansers", is_active: true },
        { name: "Toners", is_active: true },
        { name: "Serums & Ampoules", is_active: true },
        { name: "Moisturizers", is_active: true },
        { name: "Sunscreen", is_active: true },
      ],
    },
  });

  const { result: collectionsResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        { title: "K-Beauty Essentials", handle: "k-beauty-essentials" },
        { title: "Sensitive Skin Care", handle: "sensitive-skin-care" },
        { title: "Brightening Routine", handle: "brightening-routine" },
      ],
    },
  });

  const categoryByName = new Map(categoryResult.map((item) => [item.name, item.id]));
  const collectionByTitle = new Map(
    collectionsResult.map((item) => [item.title, item.id])
  );

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Etude SoonJung pH 6.5 Whip Cleanser",
          category_ids: [categoryByName.get("Cleansers")!],
          collection_id: collectionByTitle.get("Sensitive Skin Care")!,
          description:
            "Low-irritation Korean cleanser with soft foam to cleanse without stripping moisture.",
          handle: "etude-soonjung-ph-65-whip-cleanser",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["150ml"] }],
          variants: [
            {
              title: "150ml",
              sku: "KSK-CLEANSER-150",
              options: { Size: "150ml" },
              prices: [
                { amount: 1450, currency_code: "bdt" },
                { amount: 14, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Anua Heartleaf 77% Soothing Toner",
          category_ids: [categoryByName.get("Toners")!],
          collection_id: collectionByTitle.get("Sensitive Skin Care")!,
          description:
            "Hydrating Korean toner with heartleaf extract to calm redness and support skin barrier.",
          handle: "anua-heartleaf-77-soothing-toner",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "KSK-TONER-250",
              options: { Size: "250ml" },
              prices: [
                { amount: 2100, currency_code: "bdt" },
                { amount: 20, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "SOME BY MI AHA BHA PHA Miracle Toner",
          category_ids: [categoryByName.get("Toners")!],
          collection_id: collectionByTitle.get("Brightening Routine")!,
          description:
            "Gentle exfoliating toner for uneven texture and clogged pores, ideal for humid weather.",
          handle: "some-by-mi-aha-bha-pha-miracle-toner",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["150ml"] }],
          variants: [
            {
              title: "150ml",
              sku: "KSK-TONER-MIRACLE-150",
              options: { Size: "150ml" },
              prices: [
                { amount: 1800, currency_code: "bdt" },
                { amount: 17, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "COSRX Advanced Snail 96 Mucin Essence",
          category_ids: [categoryByName.get("Serums & Ampoules")!],
          collection_id: collectionByTitle.get("K-Beauty Essentials")!,
          description:
            "Repairing essence with snail mucin that deeply hydrates and improves skin elasticity.",
          handle: "cosrx-advanced-snail-96-mucin-essence",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["100ml"] }],
          variants: [
            {
              title: "100ml",
              sku: "KSK-ESSENCE-SNAIL-100",
              options: { Size: "100ml" },
              prices: [
                { amount: 2050, currency_code: "bdt" },
                { amount: 19, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "SKIN1004 Madagascar Centella Ampoule",
          category_ids: [categoryByName.get("Serums & Ampoules")!],
          collection_id: collectionByTitle.get("Sensitive Skin Care")!,
          description:
            "Single-ingredient centella ampoule to soothe irritated skin and reduce sensitivity.",
          handle: "skin1004-madagascar-centella-ampoule",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["100ml"] }],
          variants: [
            {
              title: "100ml",
              sku: "KSK-AMPOULE-CENTELLA-100",
              options: { Size: "100ml" },
              prices: [
                { amount: 2350, currency_code: "bdt" },
                { amount: 22, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Klairs Freshly Juiced Vitamin Drop",
          category_ids: [categoryByName.get("Serums & Ampoules")!],
          collection_id: collectionByTitle.get("Brightening Routine")!,
          description:
            "Vitamin C serum that helps brighten dull skin and fade post-acne dark spots.",
          handle: "klairs-freshly-juiced-vitamin-drop",
          weight: 35,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["35ml"] }],
          variants: [
            {
              title: "35ml",
              sku: "KSK-SERUM-VITC-35",
              options: { Size: "35ml" },
              prices: [
                { amount: 1900, currency_code: "bdt" },
                { amount: 18, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Innisfree Green Tea Seed Hyaluronic Cream",
          category_ids: [categoryByName.get("Moisturizers")!],
          collection_id: collectionByTitle.get("K-Beauty Essentials")!,
          description:
            "Lightweight gel cream with green tea and hyaluronic acid for all-day hydration.",
          handle: "innisfree-green-tea-seed-hyaluronic-cream",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["50ml"] }],
          variants: [
            {
              title: "50ml",
              sku: "KSK-CREAM-GREEN-TEA-50",
              options: { Size: "50ml" },
              prices: [
                { amount: 2200, currency_code: "bdt" },
                { amount: 21, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Beauty of Joseon Relief Sun SPF50+",
          category_ids: [categoryByName.get("Sunscreen")!],
          collection_id: collectionByTitle.get("K-Beauty Essentials")!,
          description:
            "Rice + probiotic sunscreen with no white cast, suitable for tropical daily use.",
          handle: "beauty-of-joseon-relief-sun-spf50",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: PRODUCT_IMAGE_PATH }],
          options: [{ title: "Size", values: ["50ml"] }],
          variants: [
            {
              title: "50ml",
              sku: "KSK-SUNSCREEN-RELIEF-50",
              options: { Size: "50ml" },
              prices: [
                { amount: 1750, currency_code: "bdt" },
                { amount: 16, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });

  logger.info("Finished seeding Korean skincare product data.");

  logger.info("Seeding inventory levels...");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    inventoryLevels.push({
      location_id: stockLocation.id,
      stocked_quantity: 1000,
      inventory_item_id: inventoryItem.id,
    });
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevels,
      },
    });
  }

  logger.info("Finished seeding inventory levels data.");
}
