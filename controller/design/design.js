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
export const CreateDesign = async (req, res) => {};
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
