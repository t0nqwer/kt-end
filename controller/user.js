import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
const prisma = new PrismaClient();
const { decode, verify, sign } = jwt;
const createToken = (id) => {
  return sign({ id }, process.env.SECRET, { expiresIn: "1h" });
};
const createRefreshToken = (id) => {
  return sign({ id }, process.env.SECRETREFRESH, { expiresIn: "12h" });
};

export const createEmployee = async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const password = data.birthday.replace("-", "").replace("-", "");
    const date = new Date(data.created_at);
    const birthday = new Date(data.birthday);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await prisma.employee.create({
      data: {
        first_name: data.frist_eng,
        last_name: data.last_eng,
        first_name_thai: data.frist_thai,
        last_name_thai: data.last_thai,
        birthday: birthday,
        password: hash,
        date_joined: date,
        role: {
          connect: {
            id: 3,
          },
        },
      },
    });
    res.status(200).json("Successfully created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const LogInUser = async (req, res) => {
  const { name, password } = req.body;
  console.log(name, password);
  try {
    const finduser = await prisma.employee.findFirst({
      where: {
        first_name: name,
      },
    });
    if (finduser === null) {
      throw Error("Incorrect id");
    }
    console.log(password, finduser.password);
    const match = await bcrypt.compare(password, finduser.password);
    if (!match) {
      throw Error("Incorrect password");
    }
    const token = createToken(finduser.Username);
    const user = await prisma.employee.findUnique({
      where: {
        id: finduser.id,
      },
      select: {
        first_name: true,
        last_name: true,
        first_name_thai: true,
        last_name_thai: true,
        birthday: true,
        role: true,
      },
    });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
