import React, { createContext, useContext, useState, useEffect } from "react";

interface UserData {
    full_name: string;
    nik: string;
    gender: "Male" | "Female";
    birth_date: string;
    birth_place: string;
    marital_status: string;
    religion: string;
    blood_type: string;
    phone: string;
    personal_email: string;
    address: string;
    city: string;
    postal_code: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    employee_code: string;
    employment_type: string;
    hire_date: string;
    department: string;
    branch: string;
    position: string;
    manager: string;
    status: string;
    bio: string;
}

const DEFAULT_USER: UserData = {
    full_name: "Sarah Anderson",
    nik: "1234567890123456",
    gender: "Female",
    birth_date: "1992-05-15",
    birth_place: "New York",
    marital_status: "Single",
    religion: "Christian",
    blood_type: "O+",
    phone: "+1 (555) 123-4567",
    personal_email: "sarah.anderson@hrflow.com",
    address: "123 Park Avenue",
    city: "New York",
    postal_code: "10001",
    emergency_contact_name: "John Anderson",
    emergency_contact_phone: "+1 (555) 987-6543",
    employee_code: "EMP-2022-001",
    employment_type: "Full-time",
    hire_date: "2022-01-10",
    department: "Human Resources",
    branch: "NYC Headquarters",
    position: "HR Manager",
    manager: "Robert Smith",
    status: "Active",
    bio: "Experienced HR Manager with a passion for building great team cultures and streamlining HR processes.",
};

interface UserContextType {
    user: UserData;
    updateUser: (data: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData>(() => {
        const saved = localStorage.getItem("user_data");
        return saved ? JSON.parse(saved) : DEFAULT_USER;
    });

    const updateUser = (data: Partial<UserData>) => {
        const newUser = { ...user, ...data };
        setUser(newUser);
        localStorage.setItem("user_data", JSON.stringify(newUser));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
