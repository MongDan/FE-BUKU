export const getTokenFromCookies = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token;
};

export const checkServerConnection = async () => {
  try {
    const token = getTokenFromCookies();
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      signal: AbortSignal.timeout(5000),
    });
    console.log("Server connection test:", response.status);
    return response.ok;
  } catch (error) {
    console.error("Server connection error:", error);
    return false;
  }
};

export const fetchBooks = async () => {
  const token = getTokenFromCookies();

  try {
    const response = await fetch("http://localhost:3000/buku", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("Fetch books response status:", response.status);

    const data = await response.json();
    console.log("Fetch books response data:", data);

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Gagal mendapatkan data buku");
    }
  } catch (err) {
    console.error("Error fetching books:", err);
    throw err;
  }
};

export const fetchStatusOptions = async () => {
  const token = getTokenFromCookies();

  try {
    const response = await fetch("http://localhost:3000/statusBuku", {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("Fetch status options response status:", response.status);

    const data = await response.json();
    console.log("Fetch status options response data:", data);

    if (response.ok) {
      // Store in sessionStorage for later use
      sessionStorage.setItem("statusOptions", JSON.stringify(data.data));
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch status options");
    }
  } catch (err) {
    console.error("Error fetching status options:", err);

    // Try to get from sessionStorage if API fails
    const storedStatusOptions = sessionStorage.getItem("statusOptions");
    if (storedStatusOptions) {
      return JSON.parse(storedStatusOptions);
    }
    throw err;
  }
};

export const addBook = async (bookData) => {
  const token = getTokenFromCookies();

  try {
    const response = await fetch("http://localhost:3000/buku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(bookData),
    });

    console.log("Add book response status:", response.status);

    const data = await response.json();
    console.log("Add book response data:", data);

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(
        data.message || "Terjadi kesalahan saat menambahkan buku"
      );
    }
  } catch (err) {
    console.error("Error adding book:", err);
    throw err;
  }
};

export const updateBook = async (bookId, bookData) => {
  const token = getTokenFromCookies();

  try {
    const response = await fetch(`http://localhost:3000/buku/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(bookData),
    });

    console.log("Update book response status:", response.status);

    const data = await response.json();
    console.log("Update book response data:", data);

    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Terjadi kesalahan saat mengupdate buku");
    }
  } catch (err) {
    console.error("Error updating book:", err);
    throw err;
  }
};

export const deleteBook = async (bukuId) => {
  const token = getTokenFromCookies();

  try {
    const response = await fetch(`http://localhost:3000/buku/${bukuId}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    console.log("Delete book response status:", response.status);

    const data = await response.json();
    console.log("Delete book response data:", data);

    if (response.ok) {
      return true;
    } else {
      throw new Error(data.message || "Terjadi kesalahan saat menghapus buku");
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    throw err;
  }
};
