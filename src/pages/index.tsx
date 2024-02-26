import { type FormEvent, useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { type RouterOutputs, api } from "~/utils/api";
import Image from "next/image";
import moment from "moment";
import { ConfirmationBox, VoidBox } from "~/shared/ModelBoxes";
import {
    UploadButton,
    UploadDropzone,
    useUploadThing,
} from "~/utils/uploadthing";


type Inventory = RouterOutputs["product"]["getAll"][0];

export default function Page() {
    const {data, isLoading} = api.product.getAll.useQuery({is_admin: true});
    const [filteredData, setFilteredData] = useState<Inventory[]>([]);
    const [isWarningModalOpen, setWarningModalOpen] = useState<null | {url: string, idx: number}>(null);
    const [isUploadModalOpen, setUploadModalOpen] = useState<null | {filename: string, idx: number, ts: number}>(null);
    const [isEditModalOpen, setEditModalOpen] = useState<null | {imageUrl: string, idx: number, ts: number}>(null);
    const [showProfileOptions, setShowProfileOptions] = useState(false);

    useEffect(() => {
        // console.log(data);
        data && setFilteredData(data);
    }, [data]);
    
    if (!data) return <div>...</div>

    const handleDelete = (image: string, idx: number) => {
        setWarningModalOpen({url: image, idx});
    }

    const handleUploadImage = (name: string, idx: number) => {
        const TIME_STAMP = moment().unix();

        const FILENAME = `${name.replace(/[^A-Z0-9]/ig, "_").toLowerCase()}-${TIME_STAMP}.jpg`;

        setUploadModalOpen({filename: FILENAME, idx, ts: TIME_STAMP});
    }

    const handleEdit = (imageUrl: string, idx: number) => {
        const NEW_TIME_STAMP = moment().unix();

        setEditModalOpen({imageUrl, idx, ts: NEW_TIME_STAMP});
    }

    const handleFilterDataWithoutImage = () => {
        setFilteredData(data.filter((item: Inventory) => !item.image));
    }

    const handleSearchByTitle = (e: FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        if (!value) return setFilteredData(data);
        if (value.length < 2) return;

        setFilteredData(data.filter((item: Inventory) => item.name.toLowerCase().includes(value.toLowerCase())));
    }

    if (isLoading) return <div>Loading...</div>

    const TOTAL_IMAGES = data.length;
    if (TOTAL_IMAGES === 0) return <div>No Inventory found...</div>

    const TOTAL_IMAGES_WITHOUT_IMAGE = data.filter((item: Inventory) => !item.image).length;


    return (
        <div>
            <div className="flex h-screen bg-gray-200">
                <div className="flex flex-col flex-1 overflow-hidden">
                    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
                        <div className="flex items-center">
                            <button className="text-gray-500 focus:outline-none lg:hidden">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round"></path>
                                </svg>
                            </button>
            
                            <div className="relative mx-4 lg:mx-0">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        </path>
                                    </svg>
                                </span>
            
                                <input onChange={handleSearchByTitle} className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-indigo-600" type="text"
                                    placeholder="Search" />
                            </div>
                        </div>
            
                        <div className="flex items-center">
                            <div className="relative">
                                <button className="flex mx-4 text-gray-600 focus:outline-none">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        </path>
                                    </svg>
                                </button>
            
                                <div className="fixed inset-0 z-10 w-full h-full" style={{display: "none"}}></div>
            
                                <div x-show="notificationOpen"
                                    className="absolute right-0 z-10 mt-2 overflow-hidden bg-white rounded-lg shadow-xl w-80"
                                    style={{width: "20rem", display: "none"}}>
                                    <a href=""
                                        className="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                                        <div className="relative object-cover w-8 h-8 mx-1 rounded-full">
                                            <Image 
                                                layout="fill"
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80"
                                                alt="avatar" />
                                        </div>
                                        <p className="mx-2 text-sm">
                                            <span className="font-bold">Sara Salah</span> replied on the <span
                                                className="font-bold text-indigo-400">Upload Image</span> artical . 2m
                                        </p>
                                    </a>
                                    <a href=""
                                        className="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                                        <div className="relative object-cover w-8 h-8 mx-1 rounded-full">
                                            <Image 
                                                layout="fill"
                                                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
                                                alt="avatar" />
                                        </div>
                                        <p className="mx-2 text-sm">
                                            <span className="font-bold">Slick Net</span> start following you . 45m
                                        </p>
                                    </a>
                                    <a href=""
                                        className="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                                        <div className="relative object-cover w-8 h-8 mx-1 rounded-full">
                                            <Image 
                                                layout="fill"
                                                src="https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80"
                                                alt="avatar" />
                                        </div>
                                        <p className="mx-2 text-sm">
                                            <span className="font-bold">Jane Doe</span> Like Your reply on <span
                                                className="font-bold text-indigo-400" >Test with TDD</span> artical . 1h
                                        </p>
                                    </a>
                                    <a href=""
                                        className="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                                        <div className="relative object-cover w-8 h-8 mx-1 rounded-full">
                                            <Image 
                                                layout="fill"
                                                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=398&amp;q=80"
                                                alt="avatar" />
                                        </div>
                                        <p className="mx-2 text-sm">
                                            <span className="font-bold">Abigail Bennett</span> start following you . 3h
                                        </p>
                                    </a>
                                </div>
                            </div>
            
                            {/* Logout button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileOptions(!showProfileOptions)}
                                    className="relative block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none">
                                    <div className="relative object-cover w-full h-full">  
                                        <Image
                                            layout="fill"
                                            src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=296&amp;q=80"
                                            alt="Your avatar" />
                                    </div>
                                </button>
            
                                {showProfileOptions && (<>
                                    <div onClick={() => setShowProfileOptions(!showProfileOptions)} className="fixed inset-0 z-10 w-full h-full"></div>
            
                                    <div
                                        className="absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl">
                                        <a href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Products</a>
                                        <SignOutButton>
                                            <div
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white cursor-pointer">Logout</div>
                                        </SignOutButton>
                                    </div>
                                </>)}
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                        <div className="container px-6 py-8 mx-auto">
                            <h3 className="text-3xl font-medium text-gray-700">Images Manager</h3>
            
                            <div className="mt-4">
                                <div className="flex flex-wrap -mx-6">
                                    <div className="w-full px-6 sm:w-1/2 xl:w-1/3" onClick={handleFilterDataWithoutImage}>
                                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                                            {/* <div className="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
                                                <svg className="w-8 h-8 text-white" viewBox="0 0 28 30" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </div> */}
                                            {/* warning sign */}
                                            <div className="p-3 bg-red-600 bg-opacity-75 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-8 h-8 text-white bi bi-exclamation-triangle pb-1" viewBox="0 0 16 16">
                                                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                                                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                                                </svg>
                                            </div>

                                            <div className="mx-5">
                                                <h4 className="text-2xl font-semibold text-gray-700">{TOTAL_IMAGES_WITHOUT_IMAGE}</h4>
                                                <div className="text-gray-500">Items Without an Image</div>
                                            </div>
                                        </div>
                                    </div>
            
                                    <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0" onClick={() => setFilteredData(data)}>
                                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                                            <div className="p-3 bg-orange-600 bg-opacity-75 rounded-full">
                                                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                                                        fill="currentColor"></path>
                                                    <path
                                                        d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </div>
            
                                            <div className="mx-5">
                                                <h4 className="text-2xl font-semibold text-gray-700">{TOTAL_IMAGES}</h4>
                                                <div className="text-gray-500">Total Items</div>
                                            </div>
                                        </div>
                                    </div>
            
                                    {/* <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                                        <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                                            <div className="p-3 bg-pink-600 bg-opacity-75 rounded-full">
                                                <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z" fill="currentColor"
                                                        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"></path>
                                                    <path
                                                        d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z"
                                                        stroke="currentColor" strokeWidth="2"></path>
                                                </svg>
                                            </div>
            
                                            <div className="mx-5">
                                                <h4 className="text-2xl font-semibold text-gray-700">215,542</h4>
                                                <div className="text-gray-500">Available Inventory</div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
            
                            <div className="flex flex-col mt-8">
                                <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                                    <div
                                        className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr>
                                                    <th
                                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                        Name</th>
                                                    <th
                                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                        Catagory</th>
                                                    <th
                                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                        Needs Image</th>
                                                    <th
                                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                                        # in Stock</th>
                                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                                                </tr>
                                            </thead>
            
                                            <tbody className="bg-white">
                                                {filteredData.map((item: Inventory, idx: number) => (
                                                    <tr key={`${item.name}-${idx}`}>
                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div className="flex items-center">
                                                                <div className="relative flex-shrink-0 w-10 h-10 rounded-full">
                                                                    {item.image ? <Image 
                                                                        layout="fill"
                                                                        src={item.image}
                                                                        alt=""
                                                                    /> : <div className="absolute w-full h-full bg-slate-300"></div>}
                                                                </div>
            
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium leading-5 text-gray-900">{item.name}</div>
                                                                    <div className="text-sm leading-5 text-gray-500">{item.price}</div>
                                                                </div>
                                                            </div>
                                                        </td>
            
                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <div className="text-sm leading-5 text-gray-500">{item.category}</div>
                                                        </td>
            
                                                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            {(item.image && <span
                                                                className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Has Image</span>) ?? 
                                                                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">No Image</span>}
                                                        </td>
            
                                                        <td
                                                            className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                                                            {item.quantity}</td>
            
                                                        <td
                                                            className="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
                                                            {(item.image && <>
                                                                <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => handleEdit(String(item.image), idx)}>Edit</a>
                                                                <span className="px-2">|</span>
                                                                <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => handleDelete(String(item.image), idx)}>Delete</a>
                                                            </>) ?? <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={() => handleUploadImage(item.name, idx)}>Upload</a>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
            </div>

            {isWarningModalOpen && <WarningDeleteBox close={() => setWarningModalOpen(null)} url={isWarningModalOpen.url} idx={isWarningModalOpen.idx} />}
            {isUploadModalOpen && <UploadImageBox close={() => setUploadModalOpen(null)} filename={isUploadModalOpen.filename} idx={isUploadModalOpen.idx} ts={isUploadModalOpen.ts} />}
            {isEditModalOpen && <EditImageBox close={() => setEditModalOpen(null)} imageUrl={isEditModalOpen.imageUrl} idx={isEditModalOpen.idx} ts={isEditModalOpen.ts} />}      
        </div>
    )
}

function WarningDeleteBox({close, url, idx}: {close: () => void, url: string, idx: number}) {
    const {mutate: Delete} = api.image.deleteImage.useMutation({onSuccess: () => window.location.reload()});
    const handleDelete = () => {
        console.log("delete");
        Delete({url, idx: `${idx+2}`});
    }

    return (
        <ConfirmationBox close={close} callback={handleDelete} title={"Warning!"}>
            You are about to delete an image. Are you sure you want to continue?
        </ConfirmationBox>
    )
}

function UploadImageBox({close, filename, idx, ts}: {close: () => void, filename: string, idx: number, ts: number}) {
    return (
        <VoidBox close={close} callback={() => {undefined}} title={"Upload Image"}>
            <UploadButton
                /**
                 * @see https://docs.uploadthing.com/api-reference/react#uploadbutton
                 */
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    console.log(`onClientUploadComplete`, res);
                    // alert("Upload Completed");
                    window.location.reload();
                }}
                onUploadBegin={() => {
                    console.log("upload begin");
                }}
                input={{ idx: `${idx+2}` }}
            />
        </VoidBox>
    )
}

function EditImageBox({close, imageUrl, idx, ts}: {close: () => void, imageUrl: string, idx: number, ts: number}) {
    return (
        <VoidBox close={close} callback={() => {undefined}} title={"Edit Image"}>
            <UploadButton
                /**
                 * @see https://docs.uploadthing.com/api-reference/react#uploadbutton
                 */
                endpoint="updateImage"
                onClientUploadComplete={(res) => {
                    console.log(`onClientUploadComplete`, res);
                    // alert("Upload Completed");
                    window.location.reload();
                }}
                onUploadBegin={() => {
                    console.log("upload begin");
                }}
                input={{ idx: `${idx+2}`, previousUrl: imageUrl.split("/").pop()! }}
            />
        </VoidBox>
    )
}

//   export default function Home() {
//     const { startUpload } = useUploadThing("imageUploader", {
//       /**
//        * @see https://docs.uploadthing.com/api-reference/react#useuploadthing
//        */
//       onClientUploadComplete: () => {
//         alert("Upload Completed");
//       },
//     });
  
//     return (
//       <main>
//         <UploadButton
//             /**
//              * @see https://docs.uploadthing.com/api-reference/react#uploadbutton
//              */
//             endpoint="imageUploader"
//             onClientUploadComplete={(res) => {
//                 console.log(`onClientUploadComplete`, res);
//                 alert("Upload Completed");
//             }}
//             onUploadBegin={() => {
//                 console.log("upload begin");
//             }}
//             input={{ idx: "1" }}
//         />
//         <UploadDropzone
//           /**
//            * @see https://docs.uploadthing.com/api-reference/react#uploaddropzone
//            */
//           endpoint="imageUploader"
//           onClientUploadComplete={(res) => {
//             console.log(`onClientUploadComplete`, res);
//             alert("Upload Completed");
//           }}
//           onUploadBegin={() => {
//             console.log("upload begin");
//           }}
//           input={{ idx: "1" }}
//         />
//         <input
//           type="file"
//           onChange={async (e) => {
//             const file = e.target.files?.[0];
//             if (!file) return;
//             // Do something with files
  
//             // Then start the upload
//             await startUpload([file], {idx:"1"});
//           }}
//         />
//       </main>
//     );
//   }