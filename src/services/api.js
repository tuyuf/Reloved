const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const BASE_DB_URL = `${SUPABASE_URL}/rest/v1`;
const BASE_AUTH_URL = `${SUPABASE_URL}/auth/v1`;
const BASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1`;

const getHeaders = (token = null, options = {}) => {
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": token ? `Bearer ${token}` : `Bearer ${SUPABASE_KEY}`,
  };
  if (!options.isFile) {
    headers["Content-Type"] = "application/json";
    // Default preference to return the object after operation
    headers["Prefer"] = options.prefer || "return=representation";
  }
  return headers;
};

const buildQuery = (params) => {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, value);
  });
  return "?" + query.toString();
};

export const api = {
  auth: {
    async signUp(email, password, metadata) {
      const res = await fetch(`${BASE_AUTH_URL}/signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password, data: metadata }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Signup failed");
      return data;
    },
    async signIn(email, password) {
      const res = await fetch(`${BASE_AUTH_URL}/token?grant_type=password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Login failed");
      return data;
    },
    async getUser(token) {
      const res = await fetch(`${BASE_AUTH_URL}/user`, {
        method: "GET",
        headers: getHeaders(token),
      });
      return res.ok ? await res.json() : null;
    },
    async signOut(token) {
      await fetch(`${BASE_AUTH_URL}/logout`, {
        method: "POST",
        headers: getHeaders(token),
      });
    },
    async updateUser(token, attributes) {
      const res = await fetch(`${BASE_AUTH_URL}/user`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(attributes),
      });
      return await res.json();
    }
  },

  db: {
    async get(table, params = {}, token = null) {
      const url = `${BASE_DB_URL}/${table}${buildQuery(params)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error(`Fetch ${table} failed`);
      return await res.json();
    },
    async insert(table, data, token = null) {
      const res = await fetch(`${BASE_DB_URL}/${table}`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Insert ${table} failed`);
      return await res.json();
    },
    async upsert(table, data, conflictColumns, token = null) {
       const res = await fetch(`${BASE_DB_URL}/${table}?on_conflict=${conflictColumns}`, {
        method: "POST",
        headers: getHeaders(token, { prefer: "resolution=merge-duplicates,return=representation" }),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Upsert ${table} failed`);
      return await res.json();
    },
    async update(table, id, data, token) {
      const res = await fetch(`${BASE_DB_URL}/${table}?id=eq.${id}`, {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Update ${table} failed`);
      return await res.json();
    },
    // Required for CartContext
    async updateWhere(table, params, data, token) {
       const url = `${BASE_DB_URL}/${table}${buildQuery(params)}`;
       const res = await fetch(url, {
         method: "PATCH",
         headers: getHeaders(token),
         body: JSON.stringify(data),
       });
       if (!res.ok) throw new Error(`UpdateWhere ${table} failed`);
    },
    async delete(table, id, token) {
      const res = await fetch(`${BASE_DB_URL}/${table}?id=eq.${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error(`Delete ${table} failed`);
      return true;
    },
    // Required for CartContext
    async deleteWhere(table, params, token) {
      const url = `${BASE_DB_URL}/${table}${buildQuery(params)}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: getHeaders(token),
      });
      if (!res.ok) throw new Error(`DeleteWhere ${table} failed`);
    }
  },

  storage: {
    async upload(bucket, path, file, token) {
      const url = `${BASE_STORAGE_URL}/object/${bucket}/${path}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
            ...getHeaders(token, { isFile: true }),
            "x-upsert": "true" 
        },
        body: file
      });
      if (!res.ok) throw new Error("Upload failed");
      return `${BASE_STORAGE_URL}/object/public/${bucket}/${path}`;
    }
  }
};