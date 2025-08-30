import { IMAGES } from "@/contants/images";
import { useNavigate } from "react-router-dom";

const AboutMirin = () => {
  const navigate = useNavigate();
  return (
    <div className="text-white my-6 mb-0 pb-9 px-1">
      <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-[auto] gap-4">
        <div className="flex items-center gap-4 mb-3">
          <h2
            className="md:text-2xl text-md font-semibold flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <img
              src={IMAGES.arrowLeft}
              alt="arrowLeft"
              className="w-6 h-6 cursor-pointer"
            />
            <span className="text-white">About Us</span>
          </h2>
        </div>
      </div>

      <h6 className="text-white text-2xl font-bold mb-2">
        Nemo enim ipsam voluptatem
      </h6>
      <p className="text-white/70 text-sm">
        Duis tincidunt nulla at urna placerat tempor. Sed Aliquam erat volutpat.
        Morbi at sodales arcu. Sed non interdum justo. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem accusantium doloremque laudantium,
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
        quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
        magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
        quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
        adipisci velit Sed quia non numquam eius modi tempora incidunt ut labore
        et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
        quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
        aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
        qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
        illum qui dolorem eum fugiat quo voluptas nulla pariatur
      </p>

      <h6 className="text-white text-2xl font-bold mb-2 mt-5">
        Nemo enim ipsam voluptatem
      </h6>
      <p className="text-white/70 text-sm">
        Duis tincidunt nulla at urna placerat tempor. Sed Aliquam erat volutpat.
        Morbi at sodales arcu. Sed non interdum justo. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem accusantium doloremque laudantium,
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
        quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
        magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
        quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
        adipisci velit Sed quia non numquam eius modi tempora incidunt ut labore
        et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
        quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
        aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
        qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
        illum qui dolorem eum fugiat quo voluptas nulla pariatur
      </p>

      <h6 className="text-white text-2xl font-bold mb-2 mt-5">
        Nemo enim ipsam voluptatem
      </h6>
      <p className="text-white/70 text-sm">
        Duis tincidunt nulla at urna placerat tempor. Sed Aliquam erat volutpat.
        Morbi at sodales arcu. Sed non interdum justo. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem accusantium doloremque laudantium,
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
        quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
        magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
        quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
        adipisci velit Sed quia non numquam eius modi tempora incidunt ut labore
        et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
        quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
        aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
        qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
        illum qui dolorem eum fugiat quo voluptas nulla pariatur
      </p>

      <h6 className="text-white text-2xl font-bold mb-2 mt-5">
        Nemo enim ipsam voluptatem
      </h6>
      <p className="text-white/70 text-sm">
        Duis tincidunt nulla at urna placerat tempor. Sed Aliquam erat volutpat.
        Morbi at sodales arcu. Sed non interdum justo. Sed ut perspiciatis unde
        omnis iste natus error sit voluptatem accusantium doloremque laudantium,
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
        architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
        quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
        magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
        quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
        adipisci velit Sed quia non numquam eius modi tempora incidunt ut labore
        et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
        quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
        aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
        qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
        illum qui dolorem eum fugiat quo voluptas nulla pariatur
      </p>
    </div>
  );
};

export default AboutMirin;
