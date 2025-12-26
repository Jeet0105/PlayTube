import { Link } from "react-router-dom";

function ChannelCard({ id, name, avatar }) {

    return (
        <Link
            to={`/channelpage/${id}`}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 hover:bg-gray-400 cursor-pointer"
        >
            <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            <h3 className="text-lg font-bold">{name}</h3>
        </Link>
    )
}

export default ChannelCard