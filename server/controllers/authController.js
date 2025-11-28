// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
  findAllUser,
} = require("../services/userService");

async function getUserById(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await findAllUser();
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message,
    });
  }
}

async function register(req, res) {
  try {
    const { nama_lengkap, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password tidak sama dengan konfirmasi" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(nama_lengkap, email, password);

    res.json({ message: "Register berhasil", user });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: err.message,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

  if (password !== user.password) {
    return res.status(400).json({ message: "Password salah" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // Extended to 24 hours
  );

  res.json({ message: "Login berhasil", token, role: user.role });
}

// async function login(req, res) {
//   const { email, password } = req.body;

//   const user = await findUserByEmail(email);
//   if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return res.status(400).json({ message: "Password salah" });

//   const token = jwt.sign(
//     { id: user.id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );
//   res.json({ message: "Login berhasil", token, role: user.role });
// }

module.exports = { register, login, getUserById, getAllUsers };
