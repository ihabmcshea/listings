// // components/PhotoSlideshow.tsx

// import React from 'react';
// import { Box, Image } from '@chakra-ui/react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// // import 'swiper/swiper-bundle.min.css';

// interface PhotoSlideshowProps {
//   photos: { url: string }[];
// }

// const PhotoSlideshow: React.FC<PhotoSlideshowProps> = ({ photos }) => {
//   return (
//     <Box width="100%" height="400px" overflow="hidden">
//       <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} navigation loop>
//         {photos.map((photo, index) => (
//           <SwiperSlide key={index}>
//             <Image src={photo.url} alt={`Slide ${index}`} objectFit="cover" width="100%" height="100%" />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </Box>
//   );
// };

// export default PhotoSlideshow;
