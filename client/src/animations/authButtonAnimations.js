import { motion } from "framer-motion";

export default function AuthButtonAnimation({ children, type }) {
	switch (type) {
		default:
			return (
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.9 }}
				>
					{children}
				</motion.div>
			);
	}
}
