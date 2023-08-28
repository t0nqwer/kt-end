import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GetDesignList = async (req, res) => {
  const { search, page } = req.query;
  const limit = 20;
  const numberStartIndex = (+page - 1) * limit;
  const count = await prisma.cloth_Design.count({
    where: {
      OR: [
        {
          Code: {
            contains: search,
          },
        },
        { Design_Name: { contains: search } },
        {
          Brand: {
            DesignBrand_Name: {
              contains: search,
            },
          },
        },
        { Category: { Design_Category_Name: { contains: search } } },
        {
          Pattern: {
            Pattern_Design_Name: {
              contains: search,
            },
          },
        },
        { Product_Description: { contains: search } },
      ],
    },
  });
  const numberPage = count / limit;
  const data = await prisma.cloth_Design.findMany({
    select: {
      Code: true,
      Design_Name: true,
      Front_Thumbnail: true,
      Back_Thumbnail: true,
      Brand: true,
      Pattern: true,
    },
    where: {
      OR: [
        {
          Code: {
            contains: search,
          },
        },
        { Design_Name: { contains: search } },
        {
          Brand: {
            DesignBrand_Name: {
              contains: search,
            },
          },
        },
        { Category: { Design_Category_Name: { contains: search } } },
        {
          Pattern: {
            Pattern_Design_Name: {
              contains: search,
            },
          },
        },
        { Product_Description: { contains: search } },
      ],
    },
    skip: numberStartIndex,
    take: limit,
  });
  res.status(200).json({ data, page: { numberPage } });
};
export const GetAddDesignData = async (req, res) => {
  try {
    const brand = await prisma.designBrand.findMany();
    const category = await prisma.design_Category.findMany();
    const pattern = await prisma.patternDesign.findMany();
    const size = await prisma.size.findMany({
      orderBy: {
        Size_Sort: "asc",
      },
    });
    const sizeDetail = await prisma.size_De.findMany();
    const code = await prisma.cloth_Design.findMany({
      select: {
        Code: true,
      },
    });
    res.status(200).json({ brand, category, pattern, size, sizeDetail, code });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
export const CreateDesign = async (req, res) => {
  const { data, image } = req.body;
  try {
    // throw Error("not implemented");
    await prisma.$transaction([
      prisma.cloth_Design.create({
        data: {
          Code: data.code,
          Design_Name: data.name,
          Front_Img: image[2],
          Back_Img: image[1],
          Front_Thumbnail: `https://storage.googleapis.com/khwantadashboard.appspot.com/Design/front/${data.code}-front_300x450`,
          Back_Thumbnail: `https://storage.googleapis.com/khwantadashboard.appspot.com/Design/back/${data.code}-front_300x450`,
          Brand_ID: data.brand,
          Category_ID: data.category,
          Pattern_ID: data.pattern,
          Detail_img: {
            create: [...image[0].map((image) => ({ Img_Url: image }))],
          },
          Size: {
            create: [
              ...data.size.map((size) => ({
                Size_Info_ID: `${data.code}${size.Size_ID}`,
                Size_ID: size.Size_ID,
              })),
            ],
          },
        },
      }),
      prisma.size_De_Info.createMany({
        data: data.sizeInput.map((p) => ({
          Size_De_Info_ID: `${data.code}${p.id}`,
          Size_De_ID: +p.detail,
          Size_Info_ID: `${data.code}${p.size}`,
          Info: +p.data,
        })),
      }),
    ]);
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
export const UpdateDesign = async (req, res) => {};
export const DeleteDesign = async (req, res) => {};
export const GetDesignById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.cloth_Design.findUnique({
      where: {
        Code: id,
      },
      select: {
        Code: true,
        Front_Img: true,
        Back_Img: true,
        Design_Name: true,
        Product_Description: true,
        Brand: true,
        Category: true,
        Pattern: true,
        Size: {
          select: {
            Size_ID: true,
            Size_De_Info: {
              select: {
                Size_De_Info_ID: true,
                Detail: true,
                Info: true,
              },
            },
          },
          orderBy: {
            Size: {
              Size_Sort: "asc",
            },
          },
        },
        Detail_img: {
          select: {
            Img_Url: true,
          },
        },
        product: {
          select: {
            fabric: {
              select: {
                Fabric_ID: true,
                Weaving: true,
                Color: true,
                Pattern: true,
                Type: true,
              },
            },
            product_id: true,
            price: true,
          },
        },
      },
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const AddDetailImage = async (req, res) => {};
export const RemoveDetailImage = async (req, res) => {};
