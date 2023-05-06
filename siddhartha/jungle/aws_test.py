import unittest

exec(open("aws.py").read())


class TestAWS(unittest.TestCase):
    def test_toMove(self):
        self.assertEqual(toMove({"turn_info": 0}), 0)

    def test_whoWon_redDen(self):
        self.assertEqual(
            whoWon({"piece_info": {"0_3": {"player": 0, "animal": 5}}}), "red"
        )

    def test_whoWon_blueDen(self):
        self.assertEqual(
            whoWon({"piece_info": {"8_3": {"player": 1, "animal": 5}}}), "blue"
        )

    def test_whoWon_blueEaten(self):
        self.assertEqual(
            whoWon({"piece_info": {"7_3": {"player": 1, "animal": 5}}}), "red"
        )

    def test_whoWon_redEaten(self):
        self.assertEqual(
            whoWon({"piece_info": {"7_3": {"player": 0, "animal": 5}}}), "blue"
        )

    def test_whoWon_noOne(self):
        self.assertEqual(
            whoWon(
                {
                    "piece_info": {
                        "7_3": {"player": 0, "animal": 5},
                        "5_4": {"player": 1, "animal": 5},
                    }
                }
            ),
            False,
        )

    def test_Result(self):
        self.assertEqual(
            Result(
                {"piece_info": {"7_3": {"player": 0, "animal": 5}}, "turn_info": 1},
                ["7_3", "7_4"],
            ),
            {"piece_info": {"7_4": {"player": 0, "animal": 5}}, "turn_info": 0},
        )

    def test_isTerminal_redWon(self):
        self.assertEqual(
            isTerminal({"piece_info": {"0_3": {"player": 0, "animal": 5}}}), True
        )

    def test_isTerminal_blueWon(self):
        self.assertEqual(
            isTerminal({"piece_info": {"8_3": {"player": 1, "animal": 5}}}), True
        )

    def test_isTerminal_blueEaten(self):
        self.assertEqual(
            isTerminal({"piece_info": {"7_3": {"player": 1, "animal": 5}}}), True
        )

    def test_isTerminal_redEaten(self):
        self.assertEqual(
            isTerminal({"piece_info": {"7_3": {"player": 0, "animal": 5}}}), True
        )

    def test_isTerminal_noOne(self):
        self.assertEqual(
            isTerminal(
                {
                    "piece_info": {
                        "7_3": {"player": 0, "animal": 5},
                        "5_4": {"player": 1, "animal": 5},
                    }
                }
            ),
            False,
        )

    def test_Utility_tied(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            50,
        )

    def test_Utility_theirLionGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            57,
        )

    def test_Utility_theirTigerGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            56,
        )

    def test_Utility_theirDogGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            54,
        )

    def test_Utility_theirCatGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            52,
        )

    def test_Utility_theirRatGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            58,
        )

    def test_Utility_theirPantherGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            55,
        )

    def test_Utility_theirWolfGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            53,
        )

    def test_Utility_theirElephantGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            58,
        )

    def test_Utility_ourLionGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            43,
        )

    def test_Utility_ourTigerGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            44,
        )

    def test_Utility_ourDogGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            46,
        )

    def test_Utility_ourCatGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            48,
        )

    def test_Utility_ourRatGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            42,
        )

    def test_Utility_ourPantherGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_2": {"player": 1, "animal": 3},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            45,
        )

    def test_Utility_ourWolfGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_0": {"player": 1, "animal": 8},
                    }
                }
            ),
            47,
        )

    def test_Utility_ourElephantGone(self):
        self.assertEqual(
            Utility(
                {
                    "piece_info": {
                        "0_0": {"player": 0, "animal": 7},
                        "0_6": {"player": 0, "animal": 6},
                        "1_1": {"player": 0, "animal": 4},
                        "1_5": {"player": 0, "animal": 2},
                        "2_0": {"player": 0, "animal": 1},
                        "2_2": {"player": 0, "animal": 5},
                        "2_4": {"player": 0, "animal": 3},
                        "2_6": {"player": 0, "animal": 8},
                        "8_6": {"player": 1, "animal": 7},
                        "8_0": {"player": 1, "animal": 6},
                        "7_5": {"player": 1, "animal": 4},
                        "7_1": {"player": 1, "animal": 2},
                        "6_6": {"player": 1, "animal": 1},
                        "6_4": {"player": 1, "animal": 5},
                        "6_2": {"player": 1, "animal": 3},
                    }
                }
            ),
            42,
        )

    def test_validMove_DogMoveAllDirections(self):
        dog_pieces = {"1_1": {"player": 0, "animal": 4}}
        self.assertTrue(validMove("1_1", dog_pieces, "0_1"))
        self.assertTrue(validMove("1_1", dog_pieces, "1_0"))
        self.assertTrue(validMove("1_1", dog_pieces, "2_1"))
        self.assertTrue(validMove("1_1", dog_pieces, "1_2"))

    def test_Diagonal(self):
        rat_pieces = {"0_0": {"player": 0, "animal": 1}}
        self.assertFalse(validMove("0_0", rat_pieces, "1_1"))

    def test_DiagonalEat(self):
        rat_pieces = {
            "0_0": {"player": 0, "animal": 2},
            "1_1": {"player": 1, "animal": 1},
        }
        self.assertFalse(validMove("0_0", rat_pieces, "1_1"))

    def test_validMove_TigerEatInOwnTrapsAndNormal(self):
        tiger_pieces = {
            "1_2": {"player": 0, "animal": 6},
            "0_2": {"player": 1, "animal": 5},
            "1_3": {"player": 1, "animal": 7},
            "1_1": {"player": 1, "animal": 4},
            "2_2": {"player": 1, "animal": 8},
        }
        self.assertTrue(validMove("1_2", tiger_pieces, "0_2"))
        self.assertTrue(validMove("1_2", tiger_pieces, "1_3"))
        self.assertTrue(validMove("1_2", tiger_pieces, "1_1"))
        self.assertFalse(validMove("1_2", tiger_pieces, "2_2"))

    def test_validMove_LionJumpWater(self):
        lion_pieces_obstructions = {
            "4_3": {"player": 0, "animal": 7},
            "4_2": {"player": 1, "animal": 1},
            "4_6": {"player": 1, "animal": 8},
        }
        self.assertFalse(validMove("4_3", lion_pieces_obstructions, "4_0"))
        self.assertFalse(validMove("4_3", lion_pieces_obstructions, "4_6"))
        lion_pieces_fake_o = {
            "4_3": {"player": 0, "animal": 7},
            "3_2": {"player": 1, "animal": 1},
            "3_6": {"player": 1, "animal": 8},
        }
        self.assertTrue(validMove("4_3", lion_pieces_fake_o, "4_0"))
        self.assertTrue(validMove("4_3", lion_pieces_fake_o, "4_6"))

    def test_LionEatingDuringJump(self):
        lion_pieces = {
            "4_3": {"player": 0, "animal": 7},
            "4_0": {"player": 1, "animal": 4},
        }
        self.assertTrue(validMove("4_3", lion_pieces, "4_0"))

    def test_validMove_PantherOffBoard(self):
        panther_pieces = {"0_0": {"player": 0, "animal": 5}}
        self.assertFalse(validMove("0_0", panther_pieces, "-1_0"))
        self.assertFalse(validMove("0_0", panther_pieces, "0_-1"))
        panther_pieces1 = {"8_6": {"player": 0, "animal": 5}}
        self.assertFalse(validMove("8_6", panther_pieces1, "9_6"))
        self.assertFalse(validMove("8_6", panther_pieces1, "8_7"))

    def test_MovingIntoOwnDen(self):
        rat_pieces = {"0_2": {"player": 0, "animal": 1}}
        self.assertFalse(validMove("0_2", rat_pieces, "0_3"))

    def test_EatingOwnPieces(self):
        cat_pieces = {
            "0_0": {"player": 0, "animal": 2},
            "0_1": {"player": 0, "animal": 1},
        }
        self.assertFalse(validMove("0_0", cat_pieces, "0_1"))

    def test_RatNotEatElephantFromWater(self):
        rat_pieces = {
            "3_1": {"player": 0, "animal": 1},
            "3_0": {"player": 1, "animal": 8},
        }
        self.assertFalse(validMove("3_1", rat_pieces, "3_0"))

    def test_ResultAnswer(self):
        s1 = {
            'piece_info': {
                "3_1": {"player": 0, "animal": 2},
                "3_0": {"player": 1, "animal": 1}
            },
            'turn_info': 1
        }

        s = {
            'piece_info': {
                "2_0": {"player": 0, "animal": 2},
                "3_0": {"player": 1, "animal": 1},
                
            },
            'turn_info': 0
        }
        self.assertEqual(Result(s, ['2_0', '3_1']), s1)
        
if __name__ == "__main__":
    unittest.main()
