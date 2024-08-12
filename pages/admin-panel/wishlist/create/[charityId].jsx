import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { AdminLayout } from "../../layout";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Create = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params?.charityId;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    link: "",
    price: "",
    referralCode: "",
    linkType: "ebay", // Default to eBay
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      charityId: id,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Modify the link to include the referral code based on the selected link type
    let modifiedLink = formData.link;
    if (formData.referralCode) {
      if (formData.linkType === "ebay") {
        modifiedLink += `?referral=${encodeURIComponent(formData.referralCode)}`;
      } else if (formData.linkType === "amazon") {
        modifiedLink += `?tag=${encodeURIComponent(formData.referralCode)}`;
      }
    }

    const submissionData = {
      ...formData,
      link: modifiedLink, // Use the modified link
    };

    const showToast = (type, message) => {
      toast({
        description: message,
        variant: type === "error" ? "destructive" : "default",
      });
    };

    const formDataToSubmit = new FormData();
    Object.keys(submissionData).forEach((key) => {
      formDataToSubmit.append(key, submissionData[key]);
    });

    try {
      const res = await axios.post(`/api/createItem`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setFormData({
          itemName: "",
          description: "",
          link: "",
          price: "",
          referralCode: "",
          linkType: "ebay", // Reset to default
        });
        showToast("success", "Item Imported Successfully!");
      }
    } catch (error) {
      showToast("error", "Recheck your input");
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>GiftRight | Create Item</title>
      </Head>

      <div className="p-5">
        <h1 className="text-2xl font-semibold">Create Item:</h1>

        <div className="mt-4">
          <form method="post" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="image">
                  Upload Image:<span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="file"
                  name="image"
                  id="image"
                  className="p-2 rounded-md border border-black w-full block"
                  placeholder="Upload Image"
                  required
                />
              </div>

              <div>
                <label htmlFor="itemName">
                  Item Name:<span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleChange}
                  value={formData.itemName}
                  type="text"
                  name="itemName"
                  id="itemName"
                  className="p-2 rounded-md border border-black w-full block"
                  placeholder="Enter Item Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="description">
                  Description:<span className="text-red-500">*</span>
                </label>
                <textarea
                  onChange={handleChange}
                  value={formData.description}
                  name="description"
                  id="description"
                  className="p-2 rounded-md border border-black w-full block"
                  placeholder="Enter Description"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="linkType">
                  Link Type:<span className="text-red-500">*</span>
                </label>
                <select
                  onChange={handleChange}
                  value={formData.linkType}
                  name="linkType"
                  id="linkType"
                  className="p-2 rounded-md border border-black w-full block"
                  required
                >
                  <option value="ebay">eBay</option>
                  <option value="amazon">Amazon</option>
                </select>
              </div>

              <div>
                <label htmlFor="referralCode">
                  Referral Code:
                </label>
                <input
                  onChange={handleChange}
                  value={formData.referralCode}
                  type="text"
                  name="referralCode"
                  id="referralCode"
                  className="p-2 rounded-md border border-black w-full block"
                  placeholder="Enter Referral Code"
                />
              </div>

              <div>
                <label htmlFor="link">
                  Item Link:<span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleChange}
                  value={formData.link}
                  type="text"
                  name="link"
                  id="link"
                  className="p-2 rounded-md border border-black w-full block"
                  placeholder="Enter Link"
                  required
                />
              </div>

              <div>
                <label htmlFor="price">
                  Item Price:<span className="text-red-500">*</span>
                </label>
                <input
                  onChange={handleChange}
                  value={formData.price}
                  type="number"
                  min={1}
                  name="price"
                  id="price"
                  step="0.01"
                  className="p-2 rounded-md border border-black w-full block"
                  placeholder="Enter Price"
                  required
                />
              </div>

              <div className="flex justify-center space-x-2">
                <div>
                  <Link href={"/admin-panel/charity"}>
                    <button
                      type="button"
                      className="text-black py-1 px-2 rounded-md border border-black"
                    >
                      Close
                    </button>
                  </Link>
                </div>

                <div>
                  <button
                    type="submit"
                    className="text-white bg-green-400 hover:bg-green-500 py-1 px-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Create;
